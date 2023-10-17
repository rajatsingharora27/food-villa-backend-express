
export type UserReposneFromMiddleWare={
    userName:string,
    email:string,
    phoneNumber:string,
    password:string,
    role:string,
}

// export type MiddleWareCompleterReposneForSiginInUser={
   
//     user:UserReposneFromMiddleWare
// }

export type UserData={
    refId:string,
    user:UserReposneFromMiddleWare
}