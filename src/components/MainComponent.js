import React, { Component } from 'react';
import Home from './HomeComponent';
import {Switch, Route, Redirect , withRouter} from 'react-router-dom';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Menu from './MenuComponents';
import About from './AboutComponent';
import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent';
import {connect} from 'react-redux';
import {postComment,fetchDishes,fetchComments,fetchPromos} from '../Redux/ActionCreators';
import { actions } from 'react-redux-form';


const mapStateToProps = state =>{
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

 const mapDispatchToProps = dispatch => ({
   fetchDishes: () => {dispatch(fetchDishes())},
   resetFeedbackForm: () =>{ dispatch(actions.reset('feedback')) },
   fetchComments: () => dispatch(fetchComments()),
   fetchPromos: () => dispatch(fetchPromos()),
   postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
  });

class Main extends Component {
  constructor(props) {
    super(props);

  }
  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }

  render() {
    
    const DishWithId = ({match}) => {
      return(
          <Dishdetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          />
       );
    };
    const HomePage = () => {
      return(
          <Home
           dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
            dishesLoading={this.props.dishes.isLoading}
            dishesErrMess={this.props.dishes.errMess}    
            promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
              promoLoading={this.props.promotions.isLoading}
              promoErrMess={this.props.promotions.errMess}
            leader={this.props.leaders.filter((leader) => leader.featured)[0]}
          />
      );
    }
    const AboutUsRender = () =>{
      return (
        <About leaders = {this.props.leaders} />
      );
    }
    return (
        <div>
           <Header />
            <Switch>
              <Route path='/home' component={HomePage} />
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route path='/menu/:dishId' component={DishWithId} />
              <Route exact path='/contactus' component= {() => <Contact resetFeedbackForm= {this.props.resetFeedbackForm}/> } />
              <Route exact path='/aboutus' component={AboutUsRender} />
              <Redirect to="/home" />
            </Switch>
          <Footer />
              </div>

    );
}
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
