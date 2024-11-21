import { useState } from 'react'
import { useEffect } from 'react'
import {NavLink} from 'react-router-dom'
import {useSelector} from 'react-redux'
import DeletePageDataModal from './modal/DeletePageDataModal'

const DynamicPages = () => {
    
    const termData = useSelector(state => state.DynamicPagesDataSlice?.term);
    const privacyData = useSelector(state => state.DynamicPagesDataSlice?.privacy);
    const aboutData = useSelector(state => state.DynamicPagesDataSlice?.about);
    
    const [formattedDate, setFormattedDate] = useState({ term: '', privacy: '', about : '' });
    const [deletePageData, setDeletePageData] = useState('')
    const [aboutTitles, setAboutTitles] = useState([])
    
    // Helper function to format date
    const formatDate = (dateString) => {
        const date = dateString ? new Date(dateString) : null;
        return !isNaN(date) ? new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date) : '';
    };
    
    useEffect(() => {
        setFormattedDate({
            term: termData?.createdat && formatDate(termData?.createdat),
            privacy: privacyData?.createdat && formatDate(privacyData?.createdat),
            about : privacyData?.createdat && formatDate(aboutData?.createdat)
        });
    }, [termData, privacyData]);

    useEffect(() => {
        if (aboutData) {
          // Get the first two titles from the metaData array
          const titles = aboutData?.metaData?.slice(0, 2).map(value => value.title); // Slice the first two items
      
          // Apply truncation to each title (max 8 characters)
          const truncatedTitles = titles
            ?.map(item => {
              // Trim each title to a max of 8 characters and add "..." if it's longer
              return item.length > 8 ? item.slice(0, 8) + '...' : item;
            })
            .join(', '); // Join the truncated titles with commas
      
          // Set the state with the first two truncated titles
          setAboutTitles(truncatedTitles); // Assuming you have the setAboutTitles function
        }
      }, [aboutData]);
      
      
    
    

  return (
    <>
        <section>
            <div className="container pt-7 pb-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="pages-layout">
                                <div className="pages-inner">
                                    <h3>Manage Terms & Condition</h3>
                                    <div className="alluser-table w-100">
                                        <table className="table pages m-0 table-dark table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Posted On</th>
                                                    <th>Edit</th>
                                                    <th>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{termData?.title}</td>
                                                    <td>{formattedDate?.term}</td>
                                                    <td><NavLink to={`/admin/editor/${'term'}`} style={{border : "none"}} className='btn'><i className="fa-regular  fa-pen-to-square fa-lg"></i></NavLink></td>
                                                    <td><button className="btn" onClick={()=>setDeletePageData('term')}  data-bs-toggle="modal" data-bs-target="#deletepagedata"><i class="fa-solid fa-trash fa-lg"></i></button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="pages-inner">
                                    <h3>Manage Privacy & Policy</h3>
                                    <div className="alluser-table w-100">
                                        <table className="table pages m-0  table-dark table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Posted On</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{privacyData?.title}</td>
                                                        <td>{formattedDate?.privacy}</td>
                                                        <td><NavLink to={`/admin/editor/${'privacy'}`} style={{border : "none"}} className='btn'><i className="fa-regular  fa-pen-to-square fa-lg"></i></NavLink></td>
                                                        <td><button className="btn" onClick={()=>setDeletePageData('privacy')} data-bs-toggle="modal" data-bs-target="#deletepagedata"><i class="fa-solid fa-trash fa-lg"></i></button></td>
                                                    </tr>
                                                </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="pages-inner">
                                    <h3>Manage About US</h3>
                                    <div className="alluser-table w-100">
                                        <table className="table pages m-0  table-dark table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Posted On</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{aboutTitles}</td>
                                                        <td>{formattedDate?.about}</td>
                                                        <td><NavLink to={`/admin/about`} style={{border : "none"}} className='btn'><i className="fa-regular  fa-pen-to-square fa-lg"></i></NavLink></td>
                                                        <td><button className="btn" onClick={()=>setDeletePageData('about')} data-bs-toggle="modal" data-bs-target="#deletepagedata"><i class="fa-solid fa-trash fa-lg"></i></button></td>
                                                    </tr>
                                                </tbody>
                                        </table>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <DeletePageDataModal page={deletePageData} />
    </>
  )
}

export default DynamicPages