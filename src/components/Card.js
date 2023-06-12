import PopupWithImage from "./PopupWithImage.js";

import PopupWithConfirmation from "./PopupWithConfirmation.js";

import {
  popupCardImg,
  popupCardName,
  heartIconEnabled,
  heartIconDisabled,
} from "../utils/constants.js";

import {
  getElement,
  addEventToDOM,
  setAttributes,
  createApiInstance,
  handleLikeFunctionAsync,
} from "../utils/helpers.js";

export default class Card {
  constructor(data, templateSelector) {
    this._data = data;
    this._templateSelector = templateSelector;
    this._cardElement = this._getTemplate();
    this._cardImage = this._cardElement.querySelector(".card__image");
    this._cardTitle = this._cardElement.querySelector(".card__title");
    this._btnTrashIcon = this._cardElement.querySelector(".button-trash-icon");
    this._btnLikeIcon = this._cardElement.querySelector(".button-heart-icon");
    this._likesCounter = this._cardElement.querySelector(".card__likes");

    this._popupWithImage = new PopupWithImage();
    this._popupWithConfirmation = new PopupWithConfirmation();
    this._setApi = createApiInstance();
  }

  _getTemplate() {
    const template = getElement(this._templateSelector);
    const cardElement = template.content.querySelector(".card").cloneNode(true);
    return cardElement;
  }

  _handleCardLike = (evt) => {
    handleLikeFunctionAsync(
      this,
      evt,
      "button-heart-icon",
      "Icon de coração desativado apenas com bordas",
      "Icon de coração ativado com preenchimento",
      heartIconDisabled,
      heartIconEnabled,
      () => this._updateLikes(),
      this._setApi,
      this._setApi.addLike,
      this._setApi.removeLike,
      this._data._id
    );
  };

  _handleCardDelete(evt) {
    this._popupWithConfirmation.handleFormOpen(evt);
    this._popupWithConfirmation.handleFormSubmit(evt, this._data._id);
  }

  _updateLikes() {
    this._likesCounter.textContent = this._data.likes.length;
    this._userHasLiked = this._data.likes.some(
      (user) => user._id === this._currentUserId
    );

    setAttributes(this._btnLikeIcon, {
      src: this._userHasLiked ? heartIconEnabled : heartIconDisabled,
      alt: this._userHasLiked
        ? "Icon de coração ativado com preenchimento"
        : "Icon de coração desativado apenas com bordas",
    });

    this._btnLikeIcon.setAttribute(
      "data-liked",
      this._userHasLiked ? "true" : "false"
    );
  }

  async _setOwnerInfo() {
    this._currentUser = await this._setApi.getUserInfo();
    this._currentUserId = this._currentUser._id;
    this._isOwner = this._data.owner._id === this._currentUserId;
    this._btnTrashIcon.style.display = this._isOwner ? "block" : "none";
  }

  async generateInstanceCard() {
    setAttributes(this._cardImage, {
      src: this._data.link,
      alt: `Imagem de ${this._data.name}`,
    });
    this._cardTitle.textContent = this._data.name;

    await this._setOwnerInfo();

    this._updateLikes();

    addEventToDOM("mousedown", this._handleCardLike, this._btnLikeIcon);

    addEventToDOM(
      "mousedown",
      (evt) => this._handleCardDelete(evt),
      this._btnTrashIcon
    );

    this._popupWithImage.handlePopupImageOpen(
      this._cardImage,
      popupCardImg,
      popupCardName,
      this._data
    );

    return this._cardElement;
  }
}
