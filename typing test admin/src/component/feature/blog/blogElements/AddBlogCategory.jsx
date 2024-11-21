import { useDispatch, useSelector } from "react-redux";
import { handleAddBlogCategory, resetState } from "../../../../redux/AdminDataSlice";
import { useEffect, useState } from "react";

const AddBlogCategory = () => {
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg);
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg);
    const isError = useSelector(state => state.AdminDataSlice.isError);
    const errorMsg = useSelector(state => state.AdminDataSlice.errorMsg);

    const [loader, setLoader] = useState({ state: false, type: '' });
    const [error, setError] = useState({ state: false, type: '', message: '' });
    const [category, setCategory] = useState('');
    const dispatch = useDispatch();

    const submitCategory = () => {
        if (!category) {
            setError({ state: true, type: 'addBlogCategory', message: 'Enter Valid Category' });
        } else {
            const obj = { category };
            dispatch(handleAddBlogCategory(obj));
        }
    };

    useEffect(() => {
        if (isError && errorMsg?.type === 'addBlogCategory') {
            setError({ state: true, type: errorMsg?.type, message: errorMsg?.message });
            setTimeout(() => {
                setError({ state: false, message: '' });
                dispatch(resetState());
            }, 2000);
        }
    }, [isError, errorMsg]);

    useEffect(() => {
        if (isProcessing && processingMsg?.type === 'addBlogCategory') {
            setLoader({ state: true, type: processingMsg?.type });
            dispatch(resetState());
        }
    }, [isProcessing, processingMsg]);

    useEffect(() => {
        if (isFullfilled && fullFillMsg?.type === 'addBlogCategory') {
            setLoader({ state: false, type: '' });
            setCategory('');
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg]);

    return (
        <>
            {error?.state && error?.type === 'addBlogCategory' && (
                <small className="text-danger text-sm">{error?.message} !</small>
            )}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control m-0"
                    placeholder="Enter Category"
                    aria-label="Category"
                    aria-describedby="basic-addon1"
                    onChange={(event) => setCategory(event.target.value)}
                    value={category}
                />
                <button onClick={submitCategory} className="btn btn-light-info text-info font-medium" type="button">
                    {loader?.state && loader?.type === 'addBlogCategory' ? 'Adding...' : 'Add'}
                </button>
            </div>
        </>
    );
};

export default AddBlogCategory;
