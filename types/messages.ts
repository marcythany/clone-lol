import { AbstractIntlMessages } from 'next-intl'

export interface Messages extends AbstractIntlMessages {
  HomePage: {
    title: string
    description: string
    login: string
    register: string
  }
  Navigation: {
    home: string
    store: string
    collection: string
    profile: string
    settings: string
  }
  Auth: {
    username: string
    password: string
    email: string
    loginButton: string
    registerButton: string
    forgotPassword: string
  }
  Profile: {
    title: string
    summonerName: string
    tagLine: string
    region: string
    level: string
    submit: string
    loading: string
    unlink: string
    unlinkConfirm: string
    unlinkDescription: string
    cancel: string
    confirm: string
    overview: string
    champions: string
    matches: string
  }
}
