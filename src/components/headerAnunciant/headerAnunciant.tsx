"use client"

import "../../styles/components/headerAnunciant/headerAnunciant.sass"
import { TUser } from "@/types/user.types"
import Button from "../button/button"
import { Elipsis, Tag } from "../tags/tags"
import {  useModalContext } from "@/context/modalContext"
import { CreateAdvertisementModal } from "../modals/createAdvertModal"


const HeaderAnunciant=({anunciant,profile}:{anunciant:TUser,profile:TUser})=>{
    const { createAdvertModal, setCreateAdvertModal } = useModalContext()
    
    return(
        <>
            <section className="header-profile">
                <div className="profile"> 
                    <div>
                        <Elipsis name={anunciant.name}/>
                        <div className="name-advertiser">
                            <h1>{anunciant.name}</h1>
                            {
                                profile.isAdvertiser &&
                                <Tag>anunciante</Tag>           
                            }
                        </div>
                        <p className="description">{anunciant.description}</p>
                    </div> 
                    {
                        profile.id==anunciant.id && profile.isAdvertiser && <Button Style={"outline-brand-1"} onClick={()=> setCreateAdvertModal(true)}>Criar anúncio</Button>        
                    }
                </div>
            </section>
            {
                createAdvertModal &&
                <CreateAdvertisementModal/>
            }
        </>
    )
}


export default HeaderAnunciant