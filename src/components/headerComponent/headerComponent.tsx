import style from "./style.module.css"
import logo from "../../assets/horizon-logo-D2KbK6vn.svg"


export default function HeaderComponent() {
 return (
    <>
        <header className={style.header}>
            <div className={style.actions}>
                <img src={logo} alt="" />
                <button>Nova consulta</button>
            </div>
            <div className={style.yellow__bar}></div>
        </header>
    </>
 )   
}