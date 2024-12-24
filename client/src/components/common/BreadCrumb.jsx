import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ForwardArrow from './ForwardArrow';
import { clearBreadcrumbs } from '../../../store/slices/explorerSlice';

const BreadCrumb = ({ setSelectedFolderId }) => {
  const dispatch = useDispatch();
  const { breadcrumbs } = useSelector(state => state.explorer);

  const uniqueArray = breadcrumbs.filter((obj, index, self) => 
    index === self.findIndex((el) => el.id === obj.id)
  );


  const handleNavigation = (id) => {
    dispatch(clearBreadcrumbs(id));    
    setSelectedFolderId(id)
  }


  return (

    <div className="w-[700px] flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-200 ">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {uniqueArray.map((b) => <li onClick={() => handleNavigation(b?.id)} key={b?.id} className="flex items-center">
          <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">{b?.name}</button>
          <ForwardArrow />
        </li>)}
      </ol>
    </div>

  )
}

export default BreadCrumb