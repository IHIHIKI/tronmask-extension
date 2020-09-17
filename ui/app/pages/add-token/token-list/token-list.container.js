import { connect } from 'react-redux'
import TokenList from './token-list.component'

const mapStateToProps = ({ tronmask }) => {
  const { tokens } = tronmask
  return {
    tokens,
  }
}

export default connect(mapStateToProps)(TokenList)
