"use client"
import { useState } from "react"
import { createPortal } from "react-dom"
import { Input, TextArea } from "../inputs/inputs"
import "../../styles/components/modals/createAnnouncementModal.sass"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateAnnouncementData, CreateAnnouncementSchema } from "./validator"
// import closeButton from "../../img/x.png"
interface ModalAddAnnouncementProps {
    toggleModal: () => void
}
const CreateAnnouncementModal = ({toggleModal}:ModalAddAnnouncementProps ) => {
    const ref = useRef<HTMLDivElement>(null)
    const {register, handleSubmit} = useForm<CreateAnnouncementData>({
        resolver: zodResolver(CreateAnnouncementSchema)
    })
    const gallery = useState([])
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if(!ref.current) {
                return
            }

            if(!event.target) {
                return
            }

            if(!ref.current.contains(event.target as HTMLElement)) {
                toggleModal()
            }
        }
        window.addEventListener("mousedown", handleClick)

        return () => {
            window.removeEventListener("mousedown", handleClick)
        }
    }, [toggleModal])

    const createAds = async(data: CreateAnnouncementData) => {
        console.log(data)
    }

    return createPortal(
        <div className="container">
            <div ref={ref} className="create-modal">
                <div className="modal-title">
                    <h2>Criar Anúncio</h2>
                    <button>x</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit(createAds)}>
                    <h2>Informações do veículo</h2>
                    {/* <div className="label">
                        <label htmlFor= "brand">Marca</label>
                        <input id="brand" type="text" placeholder="Mercedes Benz" {...register("brand")}/>
                    </div> */}
                    <Input children="Marca" id="brand" placeholder="Mercedes Benz" {...register("brand")}/>
                    <Input children="Modelo" id="model" placeholder="A 200 CGI ADVANCE SEDAN" {...register("model")}/>
                    <div className="div-labels">
                        <Input children="Ano" id="year" placeholder="2018" {...register("year")}/>
                        <Input children="Combustível" id="fuel" placeholder="Gasolina / Etanol" {...register("fuel")}/>
                    </div>
                    <div>
                        <Input children="Quilometragem" id="quilometers" placeholder="30.000" {...register("quilometers")}/>
                        <Input children="Cor" id="color" placeholder="Branco" {...register("color")}/>
                    </div>
                    <div>
                        <Input children="Preço tabela FIPE" id="fipePrice" placeholder="R$ 48.000,00" {...register("fipePrice")} />
                        <Input children="Preço" id="price" placeholder="R$ 50.000,00" {...register("price")}/>
                    </div>
                    <TextArea children="Descrição" id="description" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et ante ac enim porta luctus. Sed leo est, tempus ac sapien ut, rhoncus ultrices mauris. Phasellus consectetur non neque at varius." {...register("description")}/>
                    <Input children="Imagem da capa" id="coverImage" placeholder="https://image.com" {...register("coverImage")}/>
                    {/* <Input children="1ª imagem da galeria" id="firstGalleryImage" placeholder="https://image.com"/>
                    <Input children="2ª imagem da galeria" id="secondGalleryImage" placeholder="https://image.com"/> */}
                    <button>Adicionar campo para imagem da galeria</button>
                    <div className="modal-form-buttons">
                        <button>Cancelar</button>
                        <button type="submit">Criar anúncio</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

const EditAnnouncementModal = ({}) => {
    return createPortal(
        <div className="container">
            <div className="edit-modal">

            </div>
        </div>,
        document.body
    )
}

export {CreateAnnouncementModal, EditAnnouncementModal}