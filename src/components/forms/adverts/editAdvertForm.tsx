"use client"
import { ChangeEvent, useContext, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TAdvertisementReq, TAdvertisementReqUpdate, advertisementReqSchema, advertisementReqUpdateSchema } from "@/schemas/advertisement.schema"
import { useCarsContext} from "@/context/carsContext"
import { Input, Select, TextArea } from "@/components/inputs/inputs"
import Button from "@/components/button/button"
import { TCar } from "@/schemas/advertsSchema"
import { Modal } from "@/components/modal/modalBase/modal"
import { DeleteAdvert } from "./deleteAdvertForm"


const EditAdvertForm = ({car}:{car:TCar}) => {

    const [brand, setBrand] = useState<string>("")
    const [fipe, setFipe] = useState<number>()
    const [year, setYear] = useState<number>()


    const galleryImages = car.galleryAdvertisement?.map((carOnList)=> carOnList.imageUrl)
    const [images, setImages] = useState<(string | null)[]>([...galleryImages || []])

    const {getCarsByBrand, cars, editAdvert} = useCarsContext()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TAdvertisementReqUpdate>({
        resolver: zodResolver(advertisementReqUpdateSchema)
    })


    const onSubmitAd: SubmitHandler<any> = async(data) => {
        data.galleryAdvertisement = images.filter((image) => image !== null && image.trim() !== "")
        data.galleryAdvertisement = data.galleryAdvertisement.map((img: string) => {
            return {
                imageUrl: img
            }
        })
        console.log(data)
        editAdvert(car.id,data)
    }

    const getFipePrice = (e:ChangeEvent<HTMLInputElement>) => {
        const foundCar = cars.find((car)=> {
            return car.name === e.target.value
        })
        if(foundCar) {
            if(foundCar.value){
                setFipe(foundCar.value)
            }
            if(foundCar.year){
                setYear(foundCar.year)
            }
        }
    }

    const addImageInput = () => {
        if(images.length < 6){
            setImages([...images, null])
        }
    }
    const addImage = (e:ChangeEvent<HTMLInputElement>, index: number) => {
        let imagesAux = images.map((image,imageIndex) => {
            if(imageIndex === index){
                return image = e.target.value
            }
            return image
        })
        setImages(imagesAux)
    }

    return (
        <form className="modal-form" onSubmit={handleSubmit(onSubmitAd)}>
            <h2>Informações do veículo</h2>
            <Input onChange={(e) => setBrand(e.target.value)} children="Marca" id="model" defaultValue={car.brand} placeholder={car.brand} register={register("brand")} list="brands"/>
            <datalist id="brands">
                <option value="outra">Outra</option>
                <option value="audi">Audi</option>
                <option value="bmw">BMW</option>
                <option value="citroën">Citroën</option>
                <option value="chevrolet">Chevrolet</option>
                <option value="fiat">Fiat</option>
                <option value="ford">Ford</option>
                <option value="honda">Honda</option>
                <option value="hyundai">Hyundai</option>
                <option value="mazda">Mazda</option>
                <option value="mitsubishi">Mitsubishi</option>
                <option value="nissan">Nissan</option>
                <option value="peugeot">Peugeot</option>
                <option value="renault">Renault</option>
                <option value="subaru">Subaru</option>
                <option value="toyota">Toyota</option>
                <option value="volkswagen">Volkswagen</option>
            </datalist>
            {errors.brand && <span className="error">{errors.brand.message}</span>}
            <Input onClick={()=>getCarsByBrand(brand)} onChange={(e)=>getFipePrice(e)} children="Modelo" id="model" defaultValue={car.model} placeholder={car.model} register={register("model")} list="models"/>
            <datalist id="models">
                {
                    cars?.map((car) => {
                        return(
                            <option value={car.name.toLowerCase()}>
                                {car.name}
                            </option>
                        )
                    })
                }
            </datalist>
            {errors.model && <span className="error">{errors.model.message}</span>}
            <div className="div-labels">
                <div className="input-box">
                    <Input onChange={(e) => setYear(Number(e.target.value))} type="number"  min="1900" max="2099" placeholder={car.year.toString()} children="Ano" id="year" defaultValue={car.year}  register={register("year", { valueAsNumber: true })}/>
                    {errors.year && <span className="error">{errors.year.message}</span>}
                </div>
                <div className="input-box">
                    <Select placeholder={car.fuel}  label="Combustível" id="fuel" register={register("fuel")}>
                        <option>Insira o Combustível</option>
                        <option value="gasolina">Gasolina</option>
                        <option value="diesel">Diesel</option>
                        <option value="etanol">Etanol</option>
                        <option value="eletrecidade">Eletrecidade</option>
                        <option value="gás natural">Gás natural</option>
                    </Select>
                    {errors.fuel && <span className="error">{errors.fuel.message}</span>}
                </div>
            </div>
            <div>
                <div className="input-box">
                    <Input type="number" maxLength={10} min={0}  children="Quilometragem" id="quilometers" defaultValue={car.price} placeholder={car.price} register={register("quilometers", { valueAsNumber: true })}/>
                    {errors.quilometers && <span className="error">{errors.quilometers.message}</span>}
                </div>
                <div className="input-box">
                    <Input children="Cor" id="color" placeholder={car.color} register={register("color")} list="colors"/>
                    <datalist id="colors">
                        <option value={car.color}>{car.color.charAt(0).toUpperCase() + car.color.slice(1)}</option>
                        <option value="vermelho">Vermelho</option>
                        <option value="azul">Azul</option>
                        <option value="verde" >Verde</option>
                        <option value="amarelo">Amarelo</option>
                        <option value="laranja">Laranja</option>
                        <option value="rosa">Rosa</option>
                        <option value="roxo">Roxo</option>
                        <option value="preto">Preto</option>
                        <option value="branco">Branco</option>
                        <option value="cinza">Cinza</option>
                    </datalist>
                    {errors.color && <span className="error">{errors.color.message}</span>}
                </div>
            </div>
            <div>
                <div className="input-box">
                    <Input onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value = e.target.value.slice(0, 9)} value={fipe?.toString()} onChange={(e)=>setFipe(Number(e.target.value))} min={0} type="number" children="Preço tabela FIPE" id="fipePrice" placeholder="R$ 48.000,00" register={register("fipePrice", { valueAsNumber: true })} />
                    {errors.fipePrice && <span className="error">{errors.fipePrice.message}</span>}
                </div>
                <div className="input-box">
                    <Input onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value = e.target.value.slice(0, 9)} type="number" children="Preço" id="price" placeholder={car.price} defaultValue={car.price} min={0} register={register("price", { valueAsNumber: true })}/>
                    {errors.price && <span className="error">{errors.price.message}</span>}
                </div>
            </div>
            <TextArea children="Descrição" id="description" placeholder={car.description} defaultValue={car.description} register={register("description")}/>
            {errors.description && <span className="error">{errors.description.message}</span>}
            <Input children="Imagem da capa" id="coverImage" placeholder={car.coverImage} defaultValue={car.coverImage} register={register("coverImage")}/>
            {errors.coverImage && <span className="error">{errors.coverImage.message}</span>}
            {
                images.map((_image, index) => {
                        return(
                            <Input value={images[index] || ""} onChange={(e:ChangeEvent<HTMLInputElement>)=>addImage(e, index)}>{`${index + 1}ª`} Imagem da galeria</Input>
                        )
                })
            }
            {
                images.length < 6 &&
                <Button Style="brand-opacity" type="button" onClick={addImageInput}>Adicionar campo para imagem da galeria</Button>   
            }
            <div className="modal-form-buttons">
                <Button Style="brand-1" type="submit" width={50} size="big">Editar</Button>
                <Modal title="deletar anuncio" modalContent={<DeleteAdvert id={car.id}/>}>
                    <Button Style="alert" width={50} type="button">Excluir</Button>
                </Modal>
            </div>
        </form>
    )
}

export {EditAdvertForm}