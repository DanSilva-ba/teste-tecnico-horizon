import FilterComponent from "../../components/filterComponent/filterComponent";
import HeaderComponent from "../../components/headerComponent/headerComponent";
import style from "./home.module.css";

export default function HomePage() {
 return (
    <>
        <HeaderComponent/>

        <div className={style.box__title}>
            <div className={style.yellow__line}></div>    
            <div className={style.box__texts}>
                <h1>Consultas</h1>
                <p>Agende, acompanhe e atualize o status das consultas da clínica.</p>
            </div>
        </div>

        <FilterComponent/>

    </>
 )   
}