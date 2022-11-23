import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getArticles } from '@ducks/admin/actions'
import GridContainer from '@components/layouts/GridContainer'
import { Icons } from '@icons'
import { colors } from '@colors'
import { isEmpty } from '@utils/js-helpers'
import { P14, S12 } from '@components/_shared/text'

import './ListOfArticleHOC.scss'

const ListOfArticleHOC = ({ getTheArticles, articles }) => {
  const [editArticle, setEditArticle] = useState(false)
  useEffect(() => {
    if (isEmpty(articles)) getTheArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const toggleEditArticle = () => setEditArticle(prevState => !prevState)
  return (
    <div className='admin-bookmarks-container'>
      <GridContainer template='570px 570px'>
        {articles.map(({ id, title, description, articles_link }) => (
          <div key={id}>
            <P14 className='flex-section edit-icon-container' bold>
              {title}
              <span onClick={toggleEditArticle} className='clickable edit-icon'>
                {Icons.editIcon(colors.darkblue70)}
              </span>
            </P14>
            <div>{description}</div>
            <div>
              <S12>Open: </S12>
              <a target='_blank' href={!articles_link.includes('http') ? 'https://' + articles_link : articles_link}>
                {articles_link}
              </a>
            </div>
          </div>
        ))}
      </GridContainer>
    </div>
  )
}
const mapStateToProps = ({ admin: { articles } }) => ({
  articles
})

const mapDispatchToProps = dispatch => ({
  getTheArticles: () => dispatch(getArticles())
})
export default connect(mapStateToProps, mapDispatchToProps)(memo(ListOfArticleHOC))
