// Write your code here
import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    specificProductData: [],
    similarDetailsData: [],
    apiStatus: '',
    productCount: 1,
  }

  componentDidMount() {
    this.getProductDetail()
  }

  getProductDetail = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const similarUpdatedData = data.similar_products.map(eachItem => ({
        title: eachItem.title,
        brand: eachItem.brand,
        price: eachItem.price,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        rating: eachItem.rating,
      }))
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        specificProductData: updatedData,
        similarDetailsData: similarUpdatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  //  TODO: update productCount State on + and - buttons

  //  TODO: render failure on button to replace path

  renderProductCartCard = () => {
    const {productCount} = this.state
    //  TODO: render add buttons with count and add to cart button
  }

  //  rendering specific product details
  renderSpecificProductDetails = () => {
    const {specificProductData} = this.setState
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = specificProductData
    return (
      <div className="product-details-card">
        <img src={imageUrl} alt="product" className="avatar-image" />
        <div className="product-details">
          <div className="details-card">
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="rating-view-details">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
          </div>
          <div className="product-cart-card">
            {this.renderProductCartCard()}
          </div>
        </div>
      </div>
    )
  }

  // rendering similar product details
  renderSimilarProductDetails = () => {
    const {similarDetailsData} = this.state
    return (
      <>
        <h1>Similar Products</h1>
        <ul className="similar-details-container">
          {similarDetailsData.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              similarDetails={eachProduct}
            />
          ))}
        </ul>
      </>
    )
  }

  // Loader view
  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  // Failure view
  renderFailureView = () => (
    <div className="failure-container">
      <img src="" alt="" className="fail-image" />
      <h1 className="fail-text">Product Not Found</h1>
      <button className="back-button" type="button">
        Continue Shopping
      </button>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="product-details-container">um</div>
      </>
    )
  }
}
export default ProductItemDetails
