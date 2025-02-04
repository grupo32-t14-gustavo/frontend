"use client"

import api from "@/services"
import { TLoginReq, TLoginRes, TProviderProps, TUserRes, TValidationSchema, TuserUpdateReq } from "@/types/user.types"
import { useRouter } from "next/navigation"
import nookies,{ setCookie,destroyCookie, parseCookies } from "nookies"
import { createContext, useContext, useEffect, useState } from "react"
import { TResetPasswordEmailReq, TResetPasswordReq } from "@/types/user.types"
import axios,{ AxiosError, AxiosResponse } from "axios"

import { SetStateAction } from "react"
import { TCommentReqSchema } from "@/types/comment.types"
import {toast} from "react-toastify"
import { TAddressUpdateReq } from "@/types/address.types"


export interface IUserContext {
  registerUser: (data: TValidationSchema) => Promise<void>
  login: (dataLogin: TLoginReq, callback: () => void) => Promise<void>
  getUserProfile: (token: string) => Promise<void>
  user: TUserRes
  logout: () => void
  sentEmail: boolean
  existantUser: boolean
  loading: boolean
  setSentEmail: React.Dispatch<SetStateAction<boolean>>
  setExistantUser: React.Dispatch<SetStateAction<boolean>>
  setLoading: React.Dispatch<SetStateAction<boolean>>
  sendResetPasswordEmail: (data: TResetPasswordEmailReq) => Promise<AxiosResponse<any, any> | undefined>
  resetPassword: (data: TResetPasswordReq, token: string) => Promise<AxiosResponse<any, any> | undefined>
  createComment:(data:TCommentReqSchema)=>void
  deleteComment: (commentId: string) => Promise<void>
  editUser: (data: TuserUpdateReq) => Promise<void>
  editAddress: (addressId: string, data: TAddressUpdateReq) => Promise<void>
  deleteUser: () => Promise<void>
}

const UserContext = createContext<IUserContext>({} as IUserContext)

export const UserProvider = ({children}: TProviderProps) => {
    const [user, setUser] = useState({} as TUserRes)
    const router = useRouter()
    const [sentEmail, setSentEmail] = useState<boolean>(false)
    const [existantUser, setExistantUser] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)

    const registerUser = async (data: TValidationSchema) => {
        try {
            const newUser: TUserRes = await api.post("/users/register", data, {
                headers: {
                  "Content-Type": "application/json"
                }
            })
            setUser(newUser)
            
            toast.success("Usuário registrado com sucesso!")
            router.push("/login")
        } catch (err: unknown) {
            if ((err as AxiosError).response && (err as AxiosError).response!.status === 409) {
                if((err as any).response.data.details.includes("Email")){
                    toast.error("O Email inserido já está em uso")
                }
                if((err as any).response.data.details.includes("CPF")){
                    toast.error("O CPF inserido já está em uso")
                }
            }
            console.error(err)
        }
    }

    const logout=()=>{
        destroyCookie(null, "userToken")
        router.refresh()
    }
    
    const getUserProfile = async (token: string) => {
        try {
            const { data } = await api.get<TUserRes>("/users/loggedUser", {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
            })
            setUser(data)
        } catch (err) {
            destroyCookie(null, "userToken")
            toast.error("Sessão Expirada. Realize o login novamente.")
            router.push("/login")
            console.error(err)
        }
    }
    

    const getUserToken=()=>{
        const {userToken}=parseCookies()
        return userToken
    }
    
    useEffect(()=> {
        const token = getUserToken()
        if(token){
            getUserProfile(token)
        }
    },[])


    const login = async (dataLogin: TLoginReq, callback: () => void) => {
        setExistantUser(true)
        try {
            const { data } = await api.post<TLoginRes>("/users/login", dataLogin)
            const { token } = data
            setCookie(null, "userToken", token, {
                maxAge: 60 * 60 * 24 * 3,
                path: "/",
            })
            if (callback) {
                callback()
            }
            router.push("/")
            router.refresh()
            toast.success("Login efetuado com sucesso!")

            getUserProfile(token)
      } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    if(err.response.status === 400){
                        setExistantUser(false)
                    }
                }
            }
            console.error(err)
      }
      finally{
        setLoading(false)
      }
    }

    const sendResetPasswordEmail = async(data: TResetPasswordEmailReq) => {
        setLoading(true)
        setExistantUser(true)
        setSentEmail(false)
        try{
            const request = await api.post("/users/resetPassword",data)

            if(request.status === 200){
                setSentEmail(true)
            }
            return request
        }catch(err: unknown){
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    if(err.response.status === 404){
                        setExistantUser(false)
                    }
                }
              }
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const resetPassword = async(data: TResetPasswordReq,token: string) => {
        setExistantUser(true)
        try{
            const request = await api.patch(`/users/resetPassword/${token}`,data)

            router.push("/login")
            toast.success("Senha redefinida com sucesso")
            return request
        }catch(err: unknown){
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    if(err.response.status === 404){
                        setExistantUser(false)
                    }
                }
              }
            console.log(err)
        }
    }
    
    const createComment=(data:TCommentReqSchema)=>{

        const token=getUserToken()
        const {postId,comment}=data
        
        try{
            const response=api.post(`/comments/${postId}`,{comment},{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Comentário adicionado")
            router.refresh()
        }catch (err) {
            toast.error("Oops! Algo deu errado ao adicionar comentário. Tente Mais tarde.")
            console.error(err)
        }
    }

    const deleteComment = async(commentId: string) => {
        const token = getUserToken()
        try{
            const response = api.delete(`/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            router.refresh()
            toast.success("Comentário removido")
        }catch(err: unknown){
            console.log(err)
            toast.error("Oops! Algo deu errado ao deletar comentário")
        }
    }

    const editUser = async(data: TuserUpdateReq) => {
        const token = getUserToken()
        try{
            const response = await api.patch("/users/update", data, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success("Usuário atualizado com sucesso")
            getUserProfile(token)
        }catch(err){
            console.log(err)
            toast.error("Algo deu errado ao atualizar os dados. Tente novamente mais tarde")
        }
    }

    const editAddress = async(addressId: string, data: TAddressUpdateReq) => {
        try{
            const token = getUserToken()
            const response = await api.patch(`/address/${addressId}`,data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success("Endereço atualizado com sucesso!")
            getUserProfile(token)
        }catch(err: unknown){
            console.log(err)
            toast.error("Algo deu errado ao atualizar seu endereço. Tente novamente mais tarde")
        }
    }

    const deleteUser = async() => {
        try{
            const token = getUserToken()
            const response = await api.delete("/users/delete", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            destroyCookie(null, "userToken")
            toast.success("Conta deletada com sucesso!")
            router.push("/")
            router.refresh()

        }catch(err: unknown){
            console.log(err)
            toast.error("Algo deu errado ao deletar seu perfil. Tente novamente mais tarde")
        }
    }

    return (
        <UserContext.Provider 
            value={{
                registerUser, login, user,
                getUserProfile, logout, sentEmail,
                existantUser, loading, setSentEmail,
                setExistantUser, setLoading,
                sendResetPasswordEmail, resetPassword,
                createComment, editUser, editAddress,
                deleteUser, deleteComment
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext)
