import style from "./filter.module.css";




export default function FilterComponent() {
 return (
    <>
       <div className={style.box__filter__buttons}>
            <div className={style.filter__button}>Todas</div>
            <div className={style.filter__button}>Agendadas</div>
            <div className={style.filter__button}>Realizadas</div>
            <div className={style.filter__button}>Canceladas</div>
            <input type="text" />
       </div>
    </>
 )   
}