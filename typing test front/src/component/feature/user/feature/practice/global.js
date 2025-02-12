import { createGlobalStyle } from "styled-components";


export const GlobalStyles = createGlobalStyle`










.NOVIBRATE-CORRECT {
background-color: #706d6d;
}

.VIBRATE {
background-color: #706d6d;
-webkit-animation: vibrate-1 0.8s linear infinite both;
animation: vibrate-1 0.8s linear infinite both;
}

.VIBRATE-ERROR {
background-color: red;
-webkit-animation: vibrate-1 0.2s linear infinity both;
animation: vibrate-1 0.2s linear infinity both;
}


.UNITKEY { 
height: 3em;
width: 3em;
color: rgba(0,0,0,0.7);
border-radius: 0.4em;
line-height: 3em;
letter-spacing: 1px;
margin: 0.4em;
transition: 0.3s;
text-align: center;
font-size: 1em;
font-family: Inter;
background-color: #121212;
border: 2px solid #706d6d;
opacity: 1;
color: #71CAC7;
opacity: 0.8;
}

.hidden-input{
opacity:0;
filter:alpha(opacity=0);
}

.keyboard-stats {
display: flex;
max-width: 1000px;
margin-top: 50px;
margin-bottom: 20px;
margin-left: auto;
margin-right: auto;
color: #71CAC7;
bottom: 10%;
justify-content: center;
text-align: center;
}

.CorrectKeyDowns{
color: inherit;
}
.IncorrectKeyDowns{
color: red;
}

.SPACEKEY { 
height: 3em;
width: 21em;
color: #71CAC7;
font-family: Inter;
border-radius: 0.4em;
line-height: 3em;
letter-spacing: 1px;
margin: 0.4em;
transition: 0.3s;
text-align: center;
font-size: 1em;
background-color: #121212;
border: 2px solid #706d6d;
opacity: 0.8;
}

@keyframes vibrate-1 {
0% {
-webkit-transform: translate(0);
transform: translate(0);
}
20% {
-webkit-transform: translate(-2px, 2px);
transform: translate(-2px, 2px);
}
40% {
-webkit-transform: translate(-2px, -2px);
transform: translate(-2px, -2px);
}
60% {
-webkit-transform: translate(2px, 2px);
transform: translate(2px, 2px);
}
80% {
-webkit-transform: translate(2px, -2px);
transform: translate(2px, -2px);
}
100% {
-webkit-transform: translate(0);
transform: translate(0);
}
}
`;
