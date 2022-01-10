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
import { Request } from "express";
import { User } from "src/user/schema/user.schema";
import { ChargeWalletDto } from "./dto/charge-wallet.dto";
import * as Iyzipay from "iyzipay";
import { Pay } from "./schema/pay.schema";
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Pay.name) private payModel: Model<Pay>
  ) {}

  /* :::::::::::::::::::::::::::::::::: chargeWallet  :::::::::::::::::::::::::::::::::: */

  async chargeWallet(
    chargeWalletDto: ChargeWalletDto,
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
      price,
    } = chargeWalletDto;

    var iyzipay = new Iyzipay({
      apiKey: "sandbox-P3VM53sr6eE8mBJQ6KI0J1YhDQtMyvTM",
      secretKey: "sandbox-5POASxwuWPNHlphJWOhNVKa6Dt80NKZt",
      uri: "https://sandbox-api.iyzipay.com",
    });

    var request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "werfd",
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: "John Doe",
        cardNumber: "5528790000000008",
        expireMonth: "12",
        expireYear: "2030",
        cvc: "123",
        registerCard: "0",
      },
      buyer: {
        id: userId.toString(),
        name: user.fullName,
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: user.email,
        identityNumber: "74300864791",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress:
          "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      basketItems: [
        {
          id: "BI101",
          name: "chargeWallet",
          category1: "Collectibles",
          category2: "Accessories",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: price,
        },
      ],
    };
    let code = await this.payModel.countDocuments({});
    code = code + 1;
    var pay = new this.payModel({
      user: user._id,
      price: price,
      code: code,
      status: "pending",
    });
    // send request to iyzipay
    const response = await new Promise<object>(function (resolve, reject) {
      iyzipay.payment.create(request, function (err, result) {
        if (result) {
          if (result.status === "failure") {
            pay.status = "failed";
            pay.errorCode = result.errorCode;
            pay.save();
            // if payment is failed
            console.log(result);
            return reject(
              new InternalServerErrorException(result.errorMessage)
            );
          }
          pay.paymentId = result.paymentId;
          pay.conversationId = result.conversationId;
          pay.save();
          return resolve(result); // success
        }
        if (err) {
          pay.save();
          console.log(err); // error
          return reject(new InternalServerErrorException(err));
        }
      });
    });

    // if payment is successfull
    // save payment to db
    // and update user wallet
    let item = await this.payModel.findOne({
      user: userId,
      status: "pending",
    });

    if (!item) {
      throw new ConflictException(Messages.USER_NOT_FOUND);
    }

    const verify = await new Promise<object>(function (resolve, reject) {
      iyzipay.payment.retrieve(
        {
          locale: Iyzipay.LOCALE.TR,
          conversationId: item.conversationId,
          paymentId: item.paymentId,
        },
        function (err, result) {
          if (result) {
            if (result.status === "failure") {
              item.status = "failed";
              item.errorCode = result.errorCode;
              item.save();
              // if payment is failed
              console.log(result);
              reject(new InternalServerErrorException(result.errorMessage));
            }
            item.status = "success";
            item.verify = true;
            item.save();
            return resolve(result); // success
          }
          if (err) {
            item.status = "failed";
            item.save();
            console.log(err); // error
            reject(new InternalServerErrorException(err));
          }
        }
      );
    });

    // update user wallet
    user.wallet = user.wallet + Number(price);
    await user.save();

    return item;
  }

  /* :::::::::::::::::::::::::::::::::::::: end :::::::::::::::::::::::::::::::::::::: */
}
