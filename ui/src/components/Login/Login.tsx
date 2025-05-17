import React, { FunctionComponent, useState } from 'react'
import { $do, connect } from '@tesler-ui/core'
import { Button, Form, Icon, Input } from 'antd'
import { Dispatch } from 'redux'
import { AppState } from '../../interfaces/reducers'
import styles from './Login.less'

export interface LoginProps {
    spin: boolean
    errorMsg: string
    onLogin: (login: string, password: string) => void
    onRegister: (login: string, password: string, firstName: string, lastName: string, middleName?: string) => void
}

export const Login: FunctionComponent<LoginProps> = props => {
    const { spin, errorMsg, onLogin, onRegister } = props
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [isRegisterMode, setIsRegisterMode] = useState(false)
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value)
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value)
    }

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value)
    }

    const handleMiddleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPatronymic(event.target.value)
    }

    const validateFields = () => {
        const errors: { [key: string]: string } = {}
        if (!login || login.length < 3) {
            errors.login = 'Введите логин (минимум 3 символа)'
        }
        if (!password || password.length < 3) {
            errors.password = 'Введите пароль (минимум 3 символа)'
        }
        if (isRegisterMode) {
            if (!firstName) {
                errors.firstName = 'Введите имя'
            }
            if (!lastName) {
                errors.lastName = 'Введите фамилию'
            }
        }
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!validateFields()) {
            return
        }
        if (isRegisterMode) {
            onRegister(login, password, firstName, lastName, patronymic)
        } else {
            onLogin(login, password)
        }
    }

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode)
        setLogin('')
        setPassword('')
        setFirstName('')
        setLastName('')
        setPatronymic('')
        setValidationErrors({})
    }

    return (
        <div className={styles.container}>
            <Form onSubmit={handleSubmit}>
                {isRegisterMode && (
                    <>
                        <Form.Item validateStatus={validationErrors.firstName ? 'error' : ''} help={validationErrors.firstName}>
                            <Input
                                prefix={<Icon type="idcard" />}
                                placeholder="Имя"
                                value={firstName}
                                onChange={handleFirstNameChange}
                            />
                        </Form.Item>
                        <Form.Item validateStatus={validationErrors.lastName ? 'error' : ''} help={validationErrors.lastName}>
                            <Input
                                prefix={<Icon type="idcard" />}
                                placeholder="Фамилия"
                                value={lastName}
                                onChange={handleLastNameChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="idcard" />}
                                placeholder="Отчество (опционально)"
                                value={patronymic}
                                onChange={handleMiddleNameChange}
                            />
                        </Form.Item>
                    </>
                )}
                <Form.Item validateStatus={validationErrors.login ? 'error' : ''} help={validationErrors.login}>
                    <Input
                        prefix={<Icon type="user" />}
                        placeholder="Логин"
                        value={login}
                        onChange={handleLoginChange}
                    />
                </Form.Item>
                <Form.Item validateStatus={validationErrors.password ? 'error' : ''} help={validationErrors.password}>
                    <Input.Password
                        prefix={<Icon type="lock" />}
                        placeholder="Пароль"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Button block autoFocus loading={spin} type="primary" htmlType="submit">
                        {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
                    </Button>
                    <span className={styles.error}>{errorMsg}</span>
                </Form.Item>
            </Form>
            <div className={styles.toggle}>
                <Button type="link" onClick={toggleMode}>
                    {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </Button>
            </div>
        </div>
    )
}

function mapStateToProps(store: AppState) {
    return {
        spin: store.session.loginSpin,
        errorMsg: store.session.errorMsg
    }
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onLogin: (login: string, password: string) => {
            dispatch($do.login({ login, password }))
        },
        onRegister: async (login: string, password: string, firstName: string, lastName: string, patronymic?: string) => {
            try {
                const response = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ login, password, firstName, lastName, patronymic })
                })

                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error(`Логин ${login} уже занят`)
                    }
                    throw new Error('Ошибка регистрации')
                }

                dispatch($do.login({ login, password }))
            } catch (error) {
                console.error('Ошибка регистрации:', error)
                dispatch($do.loginFail({ errorMsg: error.message }))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)