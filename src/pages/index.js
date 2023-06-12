import "../styles/index.css";

import {
  nameInputProfile,
  jobInputProfile,
  imgLinkInputAvatar,
  placeInputCardAdd,
  imgLinkInputCardAdd,
} from "../utils/constants.js";

import { addEventToDOM, createApiInstance } from "../utils/helpers";

import UserInfo from "../components/UserInfo.js";

import UserInfoAvatar from "../components/UserInfoAvatar";

import PopupWithForm from "../components/PopupWithForm.js";

import Section from "../components/Section.js";

import Card from "../components/Card.js";

const apiGetCards = createApiInstance();

const allCards = apiGetCards.getInitialCards();

export const cardsSection = new Section(
  {
    items: allCards,
    renderer: async (card) => {
      const newCardInstance = new Card(card, "#cards-template");
      const cardItem = await newCardInstance.generateInstanceCard();
      cardsSection.addItem(cardItem);
    },
  },
  ".cards"
);

const userInfo = new UserInfo({
  nameSelector: nameInputProfile,
  jobSelector: jobInputProfile,
});

const userInfoAvatar = new UserInfoAvatar({
  linkSelector: imgLinkInputAvatar,
});

const popupWithForm = new PopupWithForm({
  nameSelector: placeInputCardAdd,
  linkSelector: imgLinkInputCardAdd,
});

const getInstancesForDOMContentToLoad = () => {
  cardsSection.renderItems();
  userInfo.setEventListenersUserInfo();
  userInfoAvatar.setEventListenersUserInfoAvatar();
  popupWithForm.setEventListenersPopupWithForm();
};

addEventToDOM("DOMContentLoaded", getInstancesForDOMContentToLoad, document);
