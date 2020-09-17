import { connect } from 'react-redux'
import UniqueImage from './unique-image.component'

const mapStateToProps = ({ tronmask }) => {
  const { selectedAddress } = tronmask

  return {
    address: selectedAddress,
  }
}

export default connect(mapStateToProps)(UniqueImage)
