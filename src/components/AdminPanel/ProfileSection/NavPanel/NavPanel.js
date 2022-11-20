import React, { memo, useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import cn from 'classnames'
import { H3 } from '@components/_shared/text'
import { useHistory, useLocation } from 'react-router-dom'
import { array, bool } from 'prop-types'

import './NavPanel.scss'

const NavPanel = ({ navbarLinks, isStartup }) => {
  const location = useLocation()
  const history = useHistory()

  const navbarLinksForRole = useMemo(
    () => navbarLinks.filter(({ roles }) => roles.includes(isStartup ? 'startup' : 'user')),
    [navbarLinks, isStartup]
  )

  const [selectedId, setSelectedId] = useState(navbarLinks.find(link => link.path === location.pathname).id)

  useEffect(() => setSelectedId(navbarLinks.find(link => link.path === location.pathname).id), [navbarLinks, location])

  return (
    <Row>
      <Col className='navbar-wrapper-admin-panel'>
        <div className='navbar-container'>
          {navbarLinksForRole.map(({ id, name, path }) => {
            const onClickHandler = () => {
              setSelectedId(id)
              history.push(path)
            }
            const classes = cn('menu-item-style', { 'green-underline': selectedId === id })
            return (
              <H3 key={id} className={classes} onClick={onClickHandler} bold>
                {name}
              </H3>
            )
          })}
        </div>
      </Col>
    </Row>
  )
}

NavPanel.propTypes = {
  navbarLinks: array,
  isStartup: bool.isRequired
}

export default memo(NavPanel)
