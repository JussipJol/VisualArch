export const translations = {
  en: {
    nav: {
      login: '[ Log In ]',
      register: 'Registration',
    },
    hero: {
      subtitle: 'Advanced AI Paradigm',
      joinBtn: 'Join Now',
      learnBtn: 'Learn More',
    },
    concept: {
      title1: 'From Idea to Code',
      title2: 'Without Disruption',
      desc: 'The platform implements the concept of a continuous creation process. The user works in a unified workspace where three modes:',
      node1: '01. Canvas',
      node2: '02. IDE',
      node3: '03. Design',
      desc2: 'switch seamlessly and are synchronized via a single global state. This erases the line between visual design and backend engineering.',
    },
    wheel: {
      num: '// PHASE ',
      hint: 'TAP TO SPIN',
      features: {
        'value-1': {
          title: 'Full Stack in One Prompt',
          desc: 'Instead of drawing a diagram in Miro, a mockup in Figma, and writing code separately — the system generates everything at once: the architectural graph, UI mockup, and ready-to-run frontend + backend code.',
        },
        'value-2': {
          title: 'Live Architecture with AI Memory',
          desc: 'Unlike Copilot or ChatGPT, the AI remembers the entire project history, applies team patterns automatically, and suggests the next step at every iteration — no need to explain context from scratch.',
        },
        'value-3': {
          title: 'Idea to Deployment without DevOps',
          desc: 'A single click generates a CI/CD pipeline, Dockerfile, Railway/Render configs, and environment variables template — developers spend zero time on infrastructure.',
        },
      },
    },
    auth: {
      loginTitle: 'Welcome Back',
      registerTitle: 'Create Account',
      loginSub: 'Authenticate to access the V-Engine workspace.',
      registerSub: 'Join the next generation of AI architecture tools.',
      emailPlaceholder: 'Enter your email address',
      passwordPlaceholder: 'Enter your password',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      continueWith: 'Or continue with',
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
    },
  },
  ru: {
    nav: {
      login: '[ Войти ]',
      register: 'Регистрация',
    },
    hero: {
      subtitle: 'Advanced AI Paradigm',
      joinBtn: 'Присоединиться',
      learnBtn: 'Узнать больше',
    },
    concept: {
      title1: 'От идеи до кода',
      title2: 'без разрыва',
      desc: 'Платформа реализует концепцию непрерывного процесса создания. Пользователь работает в едином workspace, где три режима:',
      node1: '01. Canvas',
      node2: '02. IDE',
      node3: '03. Design',
      desc2: 'бесшовно переключаются и синхронизированы через единое глобальное состояние. Это стирает грань между визуальным дизайном и бэкенд-инжинирингом.',
    },
    wheel: {
      num: '// ФАЗА ',
      hint: 'TAP TO SPIN',
      features: {
        'value-1': {
          title: 'Полный стек за один промпт',
          desc: 'Вместо того чтобы отдельно рисовать схему в Miro, макет в Figma и писать код — система генерирует всё сразу: архитектурный граф, UI-макет и готовый frontend + backend код.',
        },
        'value-2': {
          title: 'Живая архитектура с AI-памятью',
          desc: 'В отличие от Copilot или ChatGPT, AI помнит всю историю проекта, применяет паттерны команды автоматически и на каждой итерации предлагает следующий шаг — не нужно каждый раз объяснять контекст с нуля.',
        },
        'value-3': {
          title: 'От идеи до деплоя без DevOps',
          desc: 'Одной кнопкой генерируется CI/CD pipeline, Dockerfile, конфиги для Railway/Render и шаблон переменных окружения — разработчик не тратит время на инфраструктуру.',
        },
      },
    },
    auth: {
      loginTitle: 'С возвращением',
      registerTitle: 'Создать аккаунт',
      loginSub: 'Авторизуйтесь для доступа к среде V-Engine.',
      registerSub: 'Присоединяйтесь к новому поколению инструментов AI архитектуры.',
      emailPlaceholder: 'Введите ваш email',
      passwordPlaceholder: 'Введите ваш пароль',
      loginBtn: 'Войти',
      registerBtn: 'Создать',
      continueWith: 'Или войдите через',
      noAccount: "Еще нет аккаунта?",
      hasAccount: "Уже есть аккаунт?",
    },
  },
};

export type LanguageCode = 'en' | 'ru';
