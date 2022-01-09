import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginationDto } from "src/tools/dtos/pagination-query.dto";
import { Messages } from "src/tools/messages";
import { Card } from "./schema/card.schema";
import mongoose from "mongoose";
import { isIdValid, toObjectId } from "src/tools/utils";
import { CardDto } from "./dto/card.dto";
import { Request } from "express";
import { User } from "src/user/schema/user.schema";

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<Card>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  /* :::::::::::::::::::::::::::::::::: add card :::::::::::::::::::::::::::::::::: */

  async addCard(cardDto: CardDto, req: Request): Promise<object> {
    const userId = req.user["_id"];

    /* get user from db */
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ConflictException(Messages.USER_NOT_FOUND);
    }

    const {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard,
      defeultCard,
    } = cardDto;

    /* add card */
    const card = await this.cardModel.findOneAndUpdate(
      { user: user._id, "cards.cardNumber": { $ne: cardNumber } },
      {
        $push: {
          cards: {
            cardHolderName,
            cardNumber,
            expireMonth,
            expireYear,
            cvc,
            registerCard,
            defeultCard,
          },
        },
      },
      { new: true }
    );
    if (!card) {
      throw new ConflictException(Messages.DUPLICATE_DATA);
    }
    return card;
  }

  /* :::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */

  /* :::::::::::::::::::::::::::::::::: update card :::::::::::::::::::::::::::::::::: */

  async updateCard(
    id: string,
    cardDto: CardDto,
    req: Request
  ): Promise<object> {
    const userId = req.user["_id"];

    /* get user from db */
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ConflictException(Messages.USER_NOT_FOUND);
    }

    const {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard,
      defeultCard,
    } = cardDto;

    /* find duplicate data */
    const existCard = await this.cardModel
      .findOne({
        user: user._id,
        "cards.cardNumber": cardNumber,
      })
      .select({ cards: { $elemMatch: { cardNumber: cardNumber } } });

    if (existCard && existCard._id !== id) {
      throw new ConflictException(Messages.DUPLICATE_DATA);
    }
    /* update card */
    const card = await this.cardModel.findOneAndUpdate(
      {
        user: user._id,
        "cards._id": id,
      },
      {
        $set: {
          "cards.$.cardHolderName": cardHolderName,
          "cards.$.cardNumber": cardNumber,
          "cards.$.expireMonth": expireMonth,
          "cards.$.expireYear": expireYear,
          "cards.$.cvc": cvc,
          "cards.$.registerCard": registerCard,
          "cards.$.defeultCard": defeultCard,
        },
      },
      { new: true }
    );
    if (!card) {
      throw new InternalServerErrorException(Messages.PPD_FAILURE);
    }
    return card;
  }

  /* :::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */

  /* :::::::::::::::::::::::::::::::::::: get card ::::::::::::::::::::::::::::::::::: */

  async getCard(id: string, req: Request): Promise<object> {
    const userId = req.user["_id"];

    const card = await this.cardModel
      .findOne({
        user: userId,
        "cards._id": id,
      })
      .select({ cards: { $elemMatch: { _id: id } } });

    if (!card) {
      throw new NotFoundException(Messages.PPD_FAILURE);
    }

    return card;
  }

  /* :::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */

  /* :::::::::::::::::::::::::::::::::: get all card ::::::::::::::::::::::::::::::::: */

  async getAllCard(req: Request): Promise<object> {
    const userId = req.user["_id"];

    const items = await this.cardModel
      .findOne({
        user: userId,
      })
      .select("-updatedAt -__v")
      .sort({ createdAt: -1 })
      .lean();

    const response = {
      items,
    };
    return response;
  }

  /* :::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */

  /* ::::::::::::::::::::::::::::::::::: delete card ::::::::::::::::::::::::::::::::: */

  async deleteCard(id: string, req: Request): Promise<object> {
    const userId = req.user["_id"];

    const card = await this.cardModel.findOneAndUpdate(
      { user: userId, "cards._id": id },
      {
        $pull: {
          cards: {
            _id: id,
          },
        },
      },
      { new: true }
    );
    if (!card) {
      throw new NotFoundException(Messages.DATA_NOT_FOUND);
    }
    return card;
  }

  /* :::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */
}
