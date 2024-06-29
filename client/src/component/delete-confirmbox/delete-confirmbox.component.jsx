import classes from './delete-confirmbox.module.css';

const DeleteConfirmBox=({cancelDelete,handleDelete})=>{
    return(
        <div>
            <div className={`${classes.delete_confirmation_wrapper}`}>
              <div className={`${classes.delete_confirmation_layout}`}>
                <button
                  type="button"
                  class="btn btn-light w-100 me-3"
                  onClick={cancelDelete}
                >
                  မဖျက်တော့ပါ
                </button>
                <button
                  type="button"
                  class="btn btn-danger w-100"
                  onClick={handleDelete}
                >
                  ဖျက်မည်
                </button>
              </div>
            </div>
        </div>
    )
}
export default DeleteConfirmBox;