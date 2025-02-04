import Footer from "@/components/footer/footer"
import "../../../styles/pages/profile/profile.sass"
import HeaderAnunciant from "@/components/headerAnunciant/headerAnunciant"
import { TUser } from "@/types/user.types"
import { getData } from "@/utils/api"
import { cookies } from "next/headers"
import { Suspense } from "react"
import CarsList from "@/components/cardsList/cardsList"
import { CardsLoading } from "@/components/loadings/cardsLoading/cardsLoading"
import { redirect } from "next/navigation"


const getUserLogged=async(token:string)=>{
    try{
        const response=await getData("/users/loggedUser",{
            headers:{
                Authorization: `Bearer ${token}`
            },
            cache: "no-cache"
        })
        return response
    }catch(err: unknown){
        console.log(err)
        cookies().delete("userToken")
    }
}

const getAdvertiser=async(id:string)=>{
    const response= await getData(`/users/${id}/adverts`,{
        cache:"no-cache"
    })

    return response
}

const Profile = async({params}:{params:any}) =>{
    const {id}=params
    const cookieStore = cookies()
    const userToken= cookieStore.get("userToken")
    if(!userToken){
        redirect("/login")
    }
    const profile:TUser=await getUserLogged(userToken!.value)

    const advertiser=await getAdvertiser(id)
    const {user:anunciant}:{user:TUser}=advertiser.data

    return ( 
        <>
            <header className="page-show-up">
                <HeaderAnunciant anunciant={anunciant} profile={profile}/>
            </header>
            <main className="page-show-up">
                <section className="cars">
                    <h2>Anúncios</h2>
                    <div className="cars-list">
                        <Suspense fallback={
                            <CardsLoading cards={6}/>
                        }>
                            <CarsList id={id} userLogged={profile}/> 
                        </Suspense>
                    </div>
                </section>
            </main>        
            <Footer/>
        </>
    )
}

export default Profile
