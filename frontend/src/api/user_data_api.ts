import React, { ReactElement, ReactNode } from 'react';
import logo from './logo.svg';

let currentUser: User | undefined = undefined; 

interface UserSignupProps {
    username: string,
    email: string,
    password: string
}

interface UserLoginProps {
    username: string,
    email: string,
    password: string
}

interface User {
    username: string,
    email?: string,
    id: string,
    valid: boolean
}

export async function onLogin(props: UserLoginProps) {
    const res = await fetch("/api/users/auth/login", {
        body: JSON.stringify(props)
    })

    console.log(res);
}

export function onSignout () {
    //? Make API Call
}

export function onSessionInvalidate() {
    currentUser = undefined;

    onSignout();
}

export function user() : User {
    if (currentUser){
        return currentUser
    }else{
        return {
            id: 'NULL',
            username: 'NULL',
            email: 'NULL',
            valid: false
        }
    }
    
}