import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import HomeHeader from "@/components/homeHeader/HomeHeader"
import "../styles/pages/home/home.sass"
import { iFilterListProps } from "@/components/filterList/FilterList"
import { cookies } from "next/headers"
import HeaderProfile from "@/components/headerProfile/header"
import { Suspense } from "react"
import CarsHome from "@/components/cardsList/carsHome"
import { HomePageLoading } from "@/components/loadings/homePageLoading/homePageLoading"

const Home = async({searchParams}: iFilterListProps) => {

  async function getToken(){
    const userToken = cookies().get('userToken')?.value
    return userToken
  }
  const userToken=await getToken()

  return (
    <>
      {
        !userToken ?
        <Header/> : <HeaderProfile/>
      }
      <main>
      <HomeHeader/>
      <section className="cars-section">
        <Suspense fallback={<HomePageLoading/>}>
          <CarsHome searchParams={searchParams}/>
        </Suspense>
      </section>
      </main>
      <Footer/>
    </>
  )
}


export default Home