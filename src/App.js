import React, { lazy } from 'react'
import withSuspense from '@utils/withSuspense'
import { retryLoad } from '@utils/retryReload'

import './index.scss'

const Home = withSuspense(lazy(() => retryLoad(() => import('./components/Common/Home'))))

const App = () => <Home />

export default App
