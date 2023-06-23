"use client"
import { Cards } from "@/components/cards/cards"
import Footer from "@/components/footer/footer"
import HeaderProfile from "@/components/headerProfile/header"
import "../../styles/pages/profile/profile.sass"
import { useState } from "react"
import {CreateAnnouncementModal} from "../../components/modals/modals"


const Profile = () =>{
    const [isOpenModal, setIsOpenModal] = useState(false)
    const toggleModal = () => setIsOpenModal(!isOpenModal)
    return ( 
        <main>
            <HeaderProfile />
            <main>
                <header className="header-profile" >
                    <div className="profile">  
                    <span className="iniciais">MS</span> 
                    <div className="anunciant">
                        <p className="name">Matheus Silva</p>
                        <p className="tag">Anunciante</p>
                    </div>            
                        <p className="description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam placeat repellendus doloremque.</p>
                        <button type="button" onClick={toggleModal}>Criar anúncio</button>        
                    </div>
                </header>
                {
                    isOpenModal && <CreateAnnouncementModal toggleModal={toggleModal}/>
                }
                <section className="cars-section">
                    <div className="cars-list">
                        <Cards carro={{id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100}}/>
                        <Cards carro={{id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100}}/>
                        <Cards carro={{id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100}}/>
                        <Cards carro={{id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100}}/>
                        <Cards carro={{ id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100 }} />
                        <Cards carro={{ id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100 }} />
                        <Cards carro={{ id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100 }} />
                        <Cards carro={{id: "1", name: "carro maneiro", brand: "string", year: "string", fuel: 10, "value": 100}}/>
                    </div>
                </section>         
            </main>
            <Footer/>
        </main>
    )
}

export default Profile