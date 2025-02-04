import Footer from "@/components/footer/footer"
import LoginForm from "@/components/forms/LoginForm"
import Header from "@/components/header/header"
import "../../styles/pages/formsPages/forms.sass"

const LoginPage = () => {
  return (
    <main className="forms page-show-up">
      <LoginForm/>
      <Footer/>
    </main>
  )
}

export default LoginPage