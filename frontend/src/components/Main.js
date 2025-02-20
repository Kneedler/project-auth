import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components/macro'
import user from 'reducers/user';
import thoughts from 'reducers/thoughts';
import { API_URL } from 'utils/urls';
import { OuterWrapper, HeaderWrapper, FooterWrapper } from './LogIn';

const Main = () => {
    const thoughtsItems = useSelector((store) => store.thoughts.items);
    const accessToken = useSelector((store) => store.user.accessToken);
    const username = useSelector((store) => store.user.username);
    const mode = useSelector((store) => store.user.mode);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect( () => {
        if (!accessToken) {
            navigate("/login")
        }
    }, [accessToken, navigate])

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: accessToken
            }
        } 
        fetch(API_URL(mode), options) 
            .then((res) => res.json())
            .then((data) => {
                if(data.success) { //kollar datan och om success är true (från backend)
                    dispatch(thoughts.actions.setItems(data.response));
                    dispatch(thoughts.actions.setError(null))
                } else {
                    dispatch(thoughts.actions.setItems([]));
                    dispatch(thoughts.actions.setError(data.response))
                }
            })
    }, [accessToken, dispatch])

    // I put in thoughts in postman to the database, but they dont display in the frontend

      const logOut = () => {
        batch(() => {
          dispatch(user.actions.setUserName(null));
          dispatch(user.actions.setAccessToken(null));
        });
      };

    return (
        <OuterWrapper>
            <ClonedHeadWrapper>
            <h2>{mode === "register" 
            ? "Welcome to the football page"
            : "Welcome back to the football page "}
            {username}!</h2>
            </ClonedHeadWrapper>
           {/* {thoughtsItems.map((item) => {
                return <p key={item._id}>{item.message}</p>
            })} */}
            <h3>Your football pictures</h3>
            <StyledImgWrapper>
                <img src="https://i0.wp.com/www.middleeastmonitor.com/wp-content/uploads/2022/12/AA-20221206-29663742-29663736-MOROCCO_V_SPAIN_ROUND_OF_16_FIFA_WORLD_CUP_QATAR_2022.jpg?w=1200&quality=85&strip=all&zoom=1&ssl=1"
                     alt="Marocco vs Spain 2022" 
                     title="Marocco writing history in the World Cup 2022" />
                <img src="http://static-cdn.sr.se/images/109/3307333_2048_1150.jpg?preset=1024x576"
                     alt="Mens world cup 1994" 
                     title="World Cup 1994 when the Swedish mens team came in third place" />
                <img src="https://static-cdn.sr.se/images/179/3529462_1200_675.jpg?preset=h432"
                     alt="Womens world cup 2003" 
                     title="World Cup 2003 when the Swedish ladies team came in second place" />
            </StyledImgWrapper>
            <ClonedFooterWrapper>
             <Link className="logout" to="/" onClick={logOut}>
                Log out
            </Link>
            <p>&copy;2022 Younas & Sarah | All Rights Reserved</p>
      <div class="waves">
      <div class="wave" id="wave1"></div>
      <div class="wave" id="wave2"></div>
      <div class="wave" id="wave3"></div>
      <div class="wave" id="wave4"></div>
      </div>
            </ClonedFooterWrapper>
        </OuterWrapper>
    )
}

export default Main

const ClonedHeadWrapper = styled(HeaderWrapper)`
top: 0px;
position:fixed;

 h2 {
 padding: 1rem;
 }
`

const StyledImgWrapper = styled.div`
    border: 2px solid red; 
    
 img {
    padding: 1em;
    height: 20rem;
 }


`
const ClonedFooterWrapper = styled(FooterWrapper)`
position:fixed;
bottom:0;

.logout {

}
`