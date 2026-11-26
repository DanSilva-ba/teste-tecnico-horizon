import style from "./style.module.css"
import logo from "../../assets/horizon-logo-D2KbK6vn.svg"
import ButtonComponent from "../buttonComponent/buttonComponent"

interface HeaderProps {
    onNewAppointment: () => void
}

export default function HeaderComponent({ onNewAppointment }: HeaderProps) {
 return (
    <>
        <header className={style.header}>
            <div className={style.actions}>
                <img src={logo} alt="Horizon Tecnologia" />
                <ButtonComponent variant="primary" onClick={onNewAppointment}>
                    Nova consulta
                </ButtonComponent>
            </div>
            <div className={style.yellow__bar}></div>
        </header>
    </>
 )
}
