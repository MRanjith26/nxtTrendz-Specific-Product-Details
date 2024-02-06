import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'

//  import Routes
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

//  using constants is a best practice
const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    specificProductData: {},
    similarDetailsData: [],
    apiStatus: '',
    productCount: 1,
  }

  componentDidMount() {
    this.getProductDetail()
  }

  getProductDetail = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

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
        similarDetailsData: similarUpdatedData,
        specificProductData: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  //  TODO: update productCount State on + and - buttons

  onIncrement = () => {
    const {productCount} = this.state
    if (productCount > 0) {
      this.setState(prevState => ({productCount: prevState.productCount + 1}))
    }
  }

  onDecrement = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({productCount: prevState.productCount - 1}))
    }
  }

  //  TODO: render failure on button to replace path

  renderProductCartCard = () => {
    const {productCount} = this.state
    //  TODO: render add buttons with count and add to cart button
    return (
      <div className="product-count-card">
        <div className="control-button-container">
          <button
            className="control-button"
            type="button"
            data-testid="minus"
            aria-label="minus"
            onClick={this.onDecrement}
          >
            <BsDashSquare height={50} width={50} />
          </button>
          <p className="count-text">{productCount}</p>

          <button
            className="control-button"
            type="button"
            data-testid="plus"
            aria-label="plus"
            onClick={this.onIncrement}
          >
            <BsPlusSquare height={50} width={50} />
          </button>
        </div>
        <button className="toCart-button" type="button">
          ADD TO CART
        </button>
      </div>
    )
  }

  //  rendering specific product details
  renderSpecificProductDetails = () => {
    const {specificProductData} = this.state
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
      <div className="product-card">
        <img src={imageUrl} alt="product" className="avatar-image" />
        <div className="product-details-card">
          <div className="details-card">
            <h1 className="product-detail-title">{title}</h1>
            <p className="product-detail-price">Rs {price}/-</p>
            <div className="rating-view-details">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review-text">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="head-text">
              Available: <span className="para-text">{availability}</span>
            </p>
            <p className="head-text">
              Brand: <span className="para-text">{brand}</span>
            </p>
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
        <h1 className="similar-heading">Similar Products</h1>
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

  renderCompleteProductDetails = () => (
    <>
      {this.renderSpecificProductDetails()}
      {this.renderSimilarProductDetails()}
    </>
  )

  // Loader view
  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  // Failure view
  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="fail-image"
      />
      <h1 className="fail-text">Product Not Found</h1>
      <Link to="/products">
        <button className="back-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderResponseStatusProductsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCompleteProductDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-details-container">
          {this.renderResponseStatusProductsView()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
