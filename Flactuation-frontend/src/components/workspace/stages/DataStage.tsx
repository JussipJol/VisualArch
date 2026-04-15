import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../../stores/workspace.store';
import { api } from '../../../api/client';

interface EntityField { name: string; type: string; required: boolean; unique?: boolean }
interface Entity { name: string; fields: EntityField[] }
interface Schema { entities: Entity[] }

export const DataStage = ({ projectId }: { projectId: string }) => {
  const { dataSchema, dataPreview, setData, isGenerating, setGenerating } = useWorkspaceStore();
  const [status, setStatus] = useState('');
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [sqlSchema, setSqlSchema] = useState('');
  const [count, setCount] = useState(100);
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'sql'>('preview');

  useEffect(() => {
    api.get(`/projects/${projectId}/data`).then(({ data }) => {
      if (data.schema) {
        setData(data.schema as Record<string, unknown>, data.preview || {});
        if (data.sqlSchema) setSqlSchema(data.sqlSchema);
        const first = (data.schema as Schema).entities?.[0]?.name;
        if (first) setActiveEntity(first);
      }
    }).catch(() => {});
  }, [projectId]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setGenerating(true, 'data');
    setStatus('Analyzing architecture...');
    try {
      const { data } = await api.post(`/projects/${projectId}/data/generate`, { count });
      setData(data.schema, data.preview);
      if (data.sqlSchema) setSqlSchema(data.sqlSchema);
      const first = (data.schema as Schema).entities?.[0]?.name;
      if (first) setActiveEntity(first);
      setStatus('');
    } catch {
      setStatus('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/projects/${projectId}/data/download`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      credentials: 'include',
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const schema = dataSchema as Schema | null;
  const preview = dataPreview as Record<string, Record<string, unknown>[]> | null;
  const entities = schema?.entities || [];
  const currentEntity = entities.find(e => e.name === activeEntity);
  const rows = preview?.[activeEntity || ''] || [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['preview', 'schema', 'sql'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? 'rgba(245,158,11,0.1)' : 'transparent', border: `1px solid ${activeTab === t ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`, color: activeTab === t ? '#fbbf24' : 'rgba(255,255,255,0.35)', padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>ROWS:</span>
          <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(200, +e.target.value)))} style={{ width: 60, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', fontFamily: 'inherit', fontSize: '0.75rem', outline: 'none' }} />
        </div>
        <div style={{ flex: 1 }} />
        {schema && (
          <button onClick={handleDownload} style={{ background: 'transparent', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '6px 16px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', letterSpacing: 1 }}>
            ↓ DOWNLOAD JSON
          </button>
        )}
        <button onClick={handleGenerate} disabled={isGenerating} style={{ background: isGenerating ? 'transparent' : '#f59e0b', color: '#000', border: `1px solid ${isGenerating ? 'rgba(245,158,11,0.3)' : '#f59e0b'}`, padding: '8px 20px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, opacity: isGenerating ? 0.6 : 1, transition: 'all 0.2s' }}>
          {isGenerating ? 'GENERATING...' : schema ? 'REGENERATE' : 'GENERATE DATA'}
        </button>
      </div>

      {status && <div style={{ padding: '10px 20px', background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', fontSize: '0.75rem', letterSpacing: 2 }}>{status}</div>}

      {!schema ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', letterSpacing: 4 }}>// NO DATA GENERATED</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>Generate synthetic data from your Canvas entities</div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Entity sidebar */}
          {activeTab !== 'sql' && (
            <div style={{ width: 180, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', flexShrink: 0, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: 3, padding: '0 16px', marginBottom: 12 }}>ENTITIES</div>
              {entities.map(e => (
                <div key={e.name} onClick={() => setActiveEntity(e.name)} style={{ padding: '10px 16px', cursor: 'pointer', background: activeEntity === e.name ? 'rgba(245,158,11,0.08)' : 'transparent', borderLeft: `2px solid ${activeEntity === e.name ? '#f59e0b' : 'transparent'}`, fontSize: '0.8rem', color: activeEntity === e.name ? '#fbbf24' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>
                  {e.name}
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{e.fields.length} fields</div>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {activeTab === 'preview' && currentEntity && (
              <div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  {currentEntity.fields.map(f => (
                    <div key={f.name} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
                      <span style={{ color: '#fbbf24' }}>{f.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 4 }}>:{f.type}</span>
                      {f.unique && <span style={{ color: '#00ffcc', marginLeft: 4 }}>UNIQUE</span>}
                    </div>
                  ))}
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        {currentEntity.fields.map(f => (
                          <th key={f.name} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#fbbf24', fontWeight: 600, letterSpacing: 1, whiteSpace: 'nowrap' }}>{f.name.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 10).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                          {currentEntity.fields.map(f => (
                            <td key={f.name} style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {String(row[f.name] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: 12, fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>Showing 10 of {count} records</div>
                </div>
              </div>
            )}

            {activeTab === 'schema' && currentEntity && (
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 16 }}>// MONGOOSE SCHEMA — {currentEntity.name.toUpperCase()}</div>
                <pre style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 16, fontSize: '0.75rem', color: '#fbbf24', overflowX: 'auto', margin: 0 }}>
{`const ${currentEntity.name}Schema = new Schema({
${currentEntity.fields.map(f => {
  const t = f.type === 'uuid' || f.type === 'string' ? 'String' : f.type === 'number' ? 'Number' : f.type === 'boolean' ? 'Boolean' : f.type === 'date' ? 'Date' : 'String';
  return `  ${f.name}: { type: ${t}${f.required ? ', required: true' : ''}${f.unique ? ', unique: true' : ''} }`;
}).join(',\n')}
}, { timestamps: true });`}
                </pre>
              </div>
            )}

            {activeTab === 'sql' && (
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 4, marginBottom: 16 }}>// SQL SCHEMA</div>
                <pre style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 16, fontSize: '0.75rem', color: '#fbbf24', overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {sqlSchema}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
