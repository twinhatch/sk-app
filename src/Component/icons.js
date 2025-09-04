import moment from 'moment';
import React from 'react';
import {SvgXml} from 'react-native-svg';
// import ViewShot from 'react-native-view-shot';

const HomeIcon = (color, width, height) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="Home">
  <path id="Home_2" d="M7.13478 18.7733V15.7156C7.13478 14.9351 7.77217 14.3023 8.55844 14.3023H11.4326C11.8102 14.3023 12.1723 14.4512 12.4393 14.7163C12.7063 14.9813 12.8563 15.3408 12.8563 15.7156V18.7733C12.8539 19.0978 12.9821 19.4099 13.2124 19.6402C13.4427 19.8705 13.7561 20 14.0829 20H16.0438C16.9596 20.0023 17.8388 19.6428 18.4872 19.0008C19.1356 18.3588 19.5 17.487 19.5 16.5778V7.86686C19.5 7.13246 19.1721 6.43584 18.6046 5.96467L11.934 0.675869C10.7737 -0.251438 9.11111 -0.221498 7.98539 0.746979L1.46701 5.96467C0.872741 6.42195 0.517552 7.12064 0.5 7.86686V16.5689C0.5 18.4639 2.04738 20 3.95617 20H5.87229C6.55123 20 7.103 19.4562 7.10792 18.7822L7.13478 18.7733Z" fill="${color}"/>
  </g>
  </svg>
  
  `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const HistoryIcon = (color, width, height) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21" fill="none">
  <path d="M13.7143 0C10.9863 0 8.37013 1.08367 6.44119 3.01262C4.51224 4.94156 3.42857 7.55777 3.42857 10.2857H0L4.44571 14.7314L4.52571 14.8914L9.14286 10.2857H5.71429C5.71429 5.86286 9.29143 2.28571 13.7143 2.28571C18.1371 2.28571 21.7143 5.86286 21.7143 10.2857C21.7143 14.7086 18.1371 18.2857 13.7143 18.2857C11.5086 18.2857 9.50857 17.3829 8.06857 15.9314L6.44571 17.5543C7.39819 18.512 8.53084 19.2717 9.77836 19.7895C11.0259 20.3074 12.3636 20.5731 13.7143 20.5714C16.4422 20.5714 19.0584 19.4878 20.9874 17.5588C22.9163 15.6299 24 13.0137 24 10.2857C24 7.55777 22.9163 4.94156 20.9874 3.01262C19.0584 1.08367 16.4422 4.06495e-08 13.7143 0ZM12.5714 5.71429V11.4286L17.4629 14.3314L18.2857 12.9486L14.2857 10.5714V5.71429H12.5714Z" fill="${color}"/>
  </svg>
  
      `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const NotiIcon = (color, width, height) => {
  const xml = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.7916 12.0399L15.6587 10.1553C15.4081 9.74426 15.1875 8.95231 15.1875 8.47111V6.59642C15.1875 2.95736 12.2302 0 8.60116 0C4.96211 0.0100234 2.00477 2.95736 2.00477 6.59642V8.46105C2.00477 8.94225 1.78419 9.73425 1.54359 10.1452L0.410792 12.0299C-0.0202783 12.7617 -0.120526 13.5938 0.150147 14.3156C0.42082 15.0474 1.03234 15.6289 1.83433 15.8895C2.91702 16.2504 4.00972 16.5111 5.12249 16.7015C5.23278 16.7216 5.34307 16.7316 5.45331 16.7517C5.59368 16.7718 5.74405 16.7918 5.89442 16.8118C6.15509 16.8519 6.41571 16.882 6.68638 16.9021C7.31795 16.9622 7.95958 16.9923 8.60116 16.9923C9.23273 16.9923 9.8643 16.9622 10.4859 16.9021C10.7164 16.882 10.947 16.8619 11.1676 16.8319C11.348 16.8118 11.5285 16.7918 11.7089 16.7617C11.8192 16.7517 11.9295 16.7316 12.0397 16.7116C13.1625 16.5311 14.2753 16.2504 15.358 15.8895C16.1299 15.6289 16.7214 15.0474 17.002 14.3056C17.2828 13.5538 17.2026 12.7316 16.7916 12.0399ZM9.33301 7.96985C9.33301 8.39089 8.99213 8.73173 8.57108 8.73173C8.15003 8.73173 7.8092 8.39089 7.8092 7.96985V4.86213C7.8092 4.44109 8.15003 4.10021 8.57108 4.10021C8.99213 4.10021 9.33301 4.44109 9.33301 4.86213V7.96985Z" fill="${color}"/>
  <path d="M11.4186 18.005C10.9976 19.1679 9.88483 20 8.58161 20C7.78965 20 7.00771 19.6792 6.45631 19.1078C6.13554 18.807 5.89494 18.406 5.75458 17.995C5.88489 18.015 6.01524 18.025 6.15556 18.0451C6.38615 18.0752 6.62675 18.1052 6.86735 18.1253C7.43877 18.1754 8.0202 18.2055 8.60167 18.2055C9.1731 18.2055 9.74452 18.1754 10.3059 18.1253C10.5164 18.1052 10.7269 18.0952 10.9274 18.0652C11.0878 18.0451 11.2483 18.0251 11.4186 18.005Z" fill="${color}"/>
  </svg>
      `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const ChatIcon = (color, width, height) => {
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18 2H6C4.34 2 3 3.33 3 4.97V15.88C3 17.52 4.34 18.85 6 18.85H6.76C7.56 18.85 8.32 19.16 8.88 19.72L10.59 21.41C11.37 22.18 12.64 22.18 13.42 21.41L15.13 19.72C15.69 19.16 16.46 18.85 17.25 18.85H18C19.66 18.85 21 17.52 21 15.88V4.97C21 3.33 19.66 2 18 2ZM10.38 13.01C10.79 13.01 11.13 13.35 11.13 13.76C11.13 14.17 10.79 14.51 10.38 14.51H7.7C7.26 14.51 6.85 14.3 6.59 13.94C6.34 13.6 6.28 13.18 6.4 12.78C6.75 11.71 7.61 11.13 8.37 10.61C9.17 10.07 9.62 9.73 9.62 9.15C9.62 8.63 9.2 8.21 8.68 8.21C8.16 8.21 7.75 8.64 7.75 9.16C7.75 9.57 7.41 9.91 7 9.91C6.59 9.91 6.25 9.57 6.25 9.16C6.25 7.82 7.34 6.72 8.69 6.72C10.04 6.72 11.13 7.81 11.13 9.16C11.13 10.57 10.07 11.29 9.22 11.87C8.69 12.23 8.19 12.57 7.94 13.02H10.38V13.01ZM17 13.08H16.79V13.77C16.79 14.18 16.45 14.52 16.04 14.52C15.63 14.52 15.29 14.18 15.29 13.77V13.08H13.33C13.33 13.08 13.33 13.08 13.32 13.08C12.83 13.08 12.38 12.82 12.13 12.4C11.88 11.97 11.88 11.44 12.13 11.02C12.81 9.85 13.6 8.52 14.32 7.36C14.64 6.85 15.25 6.62 15.82 6.78C16.39 6.95 16.79 7.47 16.78 8.07V11.59H17C17.41 11.59 17.75 11.93 17.75 12.34C17.75 12.75 17.41 13.08 17 13.08Z" fill="${color}"/>
  <path d="M15.29 11.5801V8.64014C14.7 9.60014 14.09 10.6301 13.54 11.5701H15.29V11.5801Z" fill="${color}"/>
  </svg>`;
  return <SvgXml xml={xml} width={width} height={height} />;
};

const SettingIcon = (color, width, height) => {
  const xml = `<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.112 3.41791L10.9414 0.42755C9.95126 -0.142517 8.40105 -0.142517 7.41093 0.42755L2.19027 3.43793C0.120015 4.83812 0 5.04814 0 7.27841V12.7091C0 14.9394 0.120015 15.1594 2.23026 16.5796L7.40094 19.57C7.90097 19.86 8.54109 20 9.17116 20C9.80124 20 10.4413 19.86 10.9314 19.57L16.152 16.5596C18.2223 15.1594 18.3423 14.9494 18.3423 12.7191V7.27841C18.3423 5.04814 18.2223 4.83812 16.112 3.41791ZM9.17116 13.2492C7.38093 13.2492 5.92073 11.789 5.92073 9.99876C5.92073 8.20852 7.38093 6.74832 9.17116 6.74832C10.9614 6.74832 12.4216 8.20852 12.4216 9.99876C12.4216 11.789 10.9614 13.2492 9.17116 13.2492Z" fill="${color}"/>
  </svg>
      `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const SearchIcon = (color, width, height) => {
  const xml = `<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.75 19C16.1683 19 19.75 15.4183 19.75 11C19.75 6.58172 16.1683 3 11.75 3C7.33172 3 3.75 6.58172 3.75 11C3.75 15.4183 7.33172 19 11.75 19Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M21.7499 20.9999L17.3999 16.6499" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const UserIcon = (color, width, height) => {
  const xml = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const SaveIcon = (color, width, height) => {
  const xml = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.9063 19.1668L9.23966 14.0742L1.573 19.1668V2.87053C1.573 2.33028 1.80378 1.81215 2.21457 1.43013C2.62537 1.04811 3.18252 0.833496 3.76347 0.833496H14.7159C15.2968 0.833496 15.854 1.04811 16.2648 1.43013C16.6755 1.81215 16.9063 2.33028 16.9063 2.87053V19.1668Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  
      `;
  return <SvgXml xml={xml} width={width} height={height} />;
};

const UserInputIcon = (color, width, height) => {
  const xml = `<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.9952 12.5444C13.9952 13.2587 13.7534 13.8227 13.2699 14.2364C12.7863 14.6501 12.1437 14.8569 11.3422 14.8569H2.65779C1.85625 14.8569 1.2137 14.6501 0.730126 14.2364C0.246554 13.8227 0.00476837 13.2587 0.00476837 12.5444C0.00476837 12.229 0.0163608 11.9209 0.0395458 11.6203C0.0627308 11.3197 0.109101 10.9953 0.178656 10.6471C0.24821 10.2989 0.335982 9.97598 0.44197 9.67836C0.547959 9.38074 0.690381 9.09056 0.869236 8.80783C1.04809 8.52509 1.25344 8.28402 1.48529 8.08461C1.71714 7.88521 2.00033 7.72598 2.33486 7.60693C2.66938 7.48789 3.03868 7.42836 3.44277 7.42836C3.50238 7.42836 3.64149 7.49235 3.86009 7.62033C4.0787 7.7483 4.32545 7.89116 4.60036 8.0489C4.87526 8.20664 5.23298 8.34949 5.67349 8.47747C6.114 8.60545 6.55617 8.66943 7 8.66943C7.44383 8.66943 7.886 8.60545 8.32651 8.47747C8.76702 8.34949 9.12473 8.20664 9.39964 8.0489C9.67455 7.89116 9.9213 7.7483 10.1399 7.62033C10.3585 7.49235 10.4976 7.42836 10.5572 7.42836C10.9613 7.42836 11.3306 7.48789 11.6651 7.60693C11.9997 7.72598 12.2829 7.88521 12.5147 8.08461C12.7466 8.28402 12.9519 8.52509 13.1308 8.80783C13.3096 9.09056 13.452 9.38074 13.558 9.67836C13.664 9.97598 13.7518 10.2989 13.8213 10.6471C13.8909 10.9953 13.9373 11.3197 13.9605 11.6203C13.9836 11.9209 13.9952 12.229 13.9952 12.5444ZM9.69773 2.14711C9.69773 2.14711 9.88404 2.31452 10.2567 2.64934C10.6293 2.98417 10.8156 3.62479 10.8156 4.57122C10.8156 5.51765 10.443 6.32568 9.69773 6.99533C8.9525 7.66497 8.05326 7.99979 7 7.99979C5.94674 7.99979 5.0475 7.66497 4.30226 6.99533C3.55703 6.32568 3.18442 5.51765 3.18442 4.57122C3.18442 3.62479 3.55703 2.81675 4.30226 2.14711C5.0475 1.47747 5.94674 1.14265 7 1.14265C8.05326 1.14265 8.9525 1.47747 9.69773 2.14711Z" fill="${color}"/>
  </svg>
      `;

  return <SvgXml xml={xml} width={width} height={height} />;
};

const PassIcon = (color, width, height) => {
  const xml = `<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_752_4010)">
  <path d="M4.61425 6.85721H10.8278V5.14293C10.8278 4.51197 10.5244 3.97328 9.91764 3.52686C9.31085 3.08043 8.57865 2.85721 7.72104 2.85721C6.86344 2.85721 6.13124 3.08043 5.52444 3.52686C4.91764 3.97328 4.61425 4.51197 4.61425 5.14293V6.85721ZM14.7113 7.71436V12.8572C14.7113 13.0953 14.5981 13.2977 14.3715 13.4644C14.145 13.631 13.8699 13.7144 13.5463 13.7144H1.8958C1.57218 13.7144 1.29709 13.631 1.07056 13.4644C0.84402 13.2977 0.730751 13.0953 0.730751 12.8572V7.71436C0.730751 7.47626 0.84402 7.27388 1.07056 7.10721C1.29709 6.94055 1.57218 6.85721 1.8958 6.85721H2.28415V5.14293C2.28415 4.04769 2.81813 3.10721 3.88609 2.3215C4.95405 1.53578 6.23237 1.14293 7.72104 1.14293C9.20972 1.14293 10.488 1.53578 11.556 2.3215C12.624 3.10721 13.1579 4.04769 13.1579 5.14293V6.85721H13.5463C13.8699 6.85721 14.145 6.94055 14.3715 7.10721C14.5981 7.27388 14.7113 7.47626 14.7113 7.71436Z" fill="${color}"/>
  </g>
  <defs>
  <clipPath id="clip0_752_4010">
  <rect width="14" height="16" fill="white" transform="matrix(1 0 0 -1 0.720703 16)"/>
  </clipPath>
  </defs>
  </svg>
      `;
  return <SvgXml xml={xml} width={width} height={height} />;
};

const ShowTicket = (book, qr) => {
  const html = `<div style="max-width: 1024px; margin:10px auto;position:relative;">
  <div style=" background: white;  padding: 2rem 1rem; border-radius: 10px; ">
      <div style=" display: flex ; align-items: center;  justify-content: space-between; margin-bottom: 0.5rem;">
              <div style=" display: flex; align-items: center; ">
              <img style=" height: 2rem ; width: 2rem ; margin-top: 0.5rem;margin-right:10px " src="https://ticket-selling-eight.vercel.app/Logo.png" alt="Logo" />
              <div style=" color: #384455 ; font-weight: bold ; font-size: 25px ">GURUBOX</div>
          </div>
          <div style=" color: #384455 ">
              <div style=" color: #384455 ; font-weight: bold ; font-size: 25px ">
                  Ticket</div>
              <div style=" font-size: 15px ">Date: ${moment(
                book?.createdAt,
              ).format('DD/MM/YYYY hh:mm A')}
              </div>

          </div>
      </div>
      <div style=" display: flex ; height: 240px ;
          background-image: linear-gradient(90deg,#d8b075,#b27f54); ">
          <img style=" width: 360px ; height: 240px " src=${qr} />
          <div style=" color: white ; padding: 1rem ">
              <h2 className=md:text-4xl text-xl font-bold>${
                book?.event_id?.name
              }</h2>
              <p style=" font-size: 25px ; margin-top: 0.5rem ">${moment(
                book?.event_id?.start_date,
              ).format('DD MMM YY')}</p>
              <p style=" font-size: 25px ; margin-top: 0.5rem ">${moment(
                book?.event_id?.start_date,
              ).format('hh:mm A')}</p>
              <p style=" font-size: 25px ; margin-top: 0.5rem ">${
                book?.event_id?.address
              }</p>
              <p style=" font-size: 25px ; margin-top: 0.5rem ">${
                book?.event_id?.city
              }, ${book?.event_id?.zip || book?.zip}</p>
          </div>
      </div>
      <div style=" display: flex ; justify-content: space-between ; margin-top: 0.5rem ; color: #5c6a77 ">
          <div style=" width: 80% ">
              <h2 style=" font-size: 35px ; font-weight: bold ">${
                book?.event_id?.name
              }</h2>
              <div style=" margin-top: 0.75rem ">
                  <p style=" font-size: 15px ">Ticket Owner</p>
                  <p style=" font-size: 25px ; font-weight: bold ">${
                    book?.name_on_ticket
                  }</p>
              </div>
              <div style=" display: flex ; gap: 1rem ; margin-top: 0.75rem ; flex-wrap: wrap ">
                  <div className=>
                      <p className=>Gender</p>
                      <p style=" font-weight: bold ; font-size: 25px ">M</p>
                  </div>
                  <div className= >
                      <p className=>Seat</p>
                      <p style=" font-weight: bold ; font-size: 25px ">23</p>
                  </div>
                  <div className=>
                      <p className=>Ticket Code</p>
                      <p style=" font-weight: bold ; font-size: 25px ">4565</p>
                  </div>
              </div>
              <div style=" padding: 0.5rem 0 ; padding-right: 1rem ; margin-top: 0.75rem ">
                  <p style=" font-weight: bold ; font-size: 15px ; margin-bottom: 0.75rem ">Please Note That</p>
                  <p style=" font-size: 15px ">Avoid being around people who are more likely to get very sick from
                      COVID-19.
                      Remember to wear a high-quality mask when indoors around others at home and in public.</p>
              </div>
          </div>
          <div style=" width: 25% ; display: flex ; flex-direction: column ; gap: 0.5rem ;
              align-items: center ">
              <div style=" display: flex ; flex-direction: column ; gap: 0.5rem ">
                  <div style=" display: flex ; justify-content: space-between ; border-bottom: 3px solid #d1d5db
                      ; gap: 1rem ; padding: 0.5rem 0.75rem "
                      className=flex justify-between border-b-2 border-gray-300 px-3 md:px-8 py-2 md:gap-4>
                      <p style=" font-weight: bold ">Quantity</p>
                      <p style=" font-weight: bold ">${book?.qty}</p>
                  </div>
                  <div style=" display: flex ; justify-content: space-between ; border-bottom: 3px solid #d1d5db
                      ; gap: 1rem ; padding: 0.5rem 0.75rem "
                      className=flex justify-between border-b-2 border-gray-300 px-3 md:px-8 py-2 md:gap-4>
                      <p style=" font-weight: bold ">Price</p>
                      <p style=" font-weight: bold ">${
                        book?.event_id?.currency
                      }${book?.price}</p>
                  </div>
                  <div style=" display: flex ; justify-content: space-between ; border-bottom: 3px solid #d1d5db
                      ; gap: 1rem ; padding: 0.5rem 0.75rem "
                      className=flex justify-between border-b-2 border-gray-300 px-3 md:px-8 py-2 md:gap-4>
                      <p style=" font-weight: bold ">Booking Fees</p>
                      <p style=" font-weight: bold ">${(
                        book?.total - book?.price
                      ).toFixed(2)}</p>
                  </div>
                  <div style=" display: flex ; justify-content: space-between ; border-bottom: 3px solid #d1d5db
                      ; gap: 1rem ; padding: 0.5rem 0.75rem "
                      className=flex justify-between border-b-2 border-gray-300 px-3 md:px-8 py-2 md:gap-4>
                      <p style=" font-weight: bold ">Total</p>
                      <p style=" font-weight: bold ">${book?.total}</p>
                  </div>
                  <div style=" display: flex ; flex-direction: column ; align-items: center ">
                      <p style=" font-size: 20px ; font-weight: bold ">QR CODE</p>
                       
                  </div>
              </div>
          </div>

      </div>
  </div>

</div>`;
  return html;
};

export {
  HistoryIcon,
  HomeIcon,
  NotiIcon,
  SettingIcon,
  SearchIcon,
  SaveIcon,
  UserIcon,
  UserInputIcon,
  PassIcon,
  ShowTicket,
  ChatIcon,
};
