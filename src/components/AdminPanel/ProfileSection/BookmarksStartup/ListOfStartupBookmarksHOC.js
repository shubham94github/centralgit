import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { getBookmarksStartup, changeFilterOfBookmarks } from '@ducks/admin/actions'
import { array, bool, func, number, object } from 'prop-types'
import ListOfStartup from '@components/_shared/ListOfStartup'
import SortForStartups from '@components/_shared/SortForStartups'

import './ListOfStartupBookmarksHOC.scss'

const ListOfStartupBookmarksHOC = ({
  getBookmarksStartup,
  startups,
  countOfRecords,
  filterBookmarks,
  changeFilterOfBookmarks,
  isLoadingListOfStartups
}) => {
  const onSelectChange = option => {
    const selectedValue = {
      field: 'fieldName',
      data: option.value
    }

    changeFilterOfBookmarks(selectedValue)
  }

  useEffect(() => {
    if (!startups.length) getBookmarksStartup({ filterBookmarks })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='admin-bookmarks-container'>
      <div className='sort-section'>
        <SortForStartups
          countOfRecords={countOfRecords}
          sort={filterBookmarks.sort.fieldName}
          onSelectChange={onSelectChange}
          countOfRecordsText='Saved Startups'
          isAdmin
        />
      </div>
      <ListOfStartup
        startups={startups}
        isLoading={isLoadingListOfStartups}
        countOfRecords={countOfRecords}
        page={filterBookmarks.page}
        pageSize={filterBookmarks.pageSize}
        setFieldForFilter={changeFilterOfBookmarks}
        width='880px'
        emptyStartupsMessage='No Bookmarks'
        isAdmin
      />
    </div>
  )
}

ListOfStartupBookmarksHOC.propTypes = {
  startups: array.isRequired,
  countOfRecords: number,
  isLoadingListOfStartups: bool,
  getBookmarksStartup: func.isRequired,
  changeFilterOfBookmarks: func.isRequired,
  filterBookmarks: object.isRequired
}

const mapStateToProps = ({
  admin: {
    bookmarksStartups: { startups, countOfRecords },
    filterBookmarks,
    isLoadingListOfStartups
  }
}) => ({
  startups,
  countOfRecords,
  isLoadingListOfStartups,
  filterBookmarks
})

export default connect(mapStateToProps, {
  getBookmarksStartup,
  changeFilterOfBookmarks
})(memo(ListOfStartupBookmarksHOC))
