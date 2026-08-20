import { createFileRoute } from '@tanstack/react-router'
import { Banner } from '#/components/banner'

export const Route = createFileRoute('/_public/policies')({
  component: PoliciesPage,
})

function PoliciesPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <Banner title="terms & conditions of use" />
      <div className="w-full max-w-4xl px-4 py-8">
        <div className="prose max-w-none">
          <p>
            <b>Terms &amp; Conditions</b>
          </p>
          <p>
            <b>Black Sheep Agribusiness (Pty) Ltd</b>
          </p>
          <p>
            Registration: 2019/500/595 Trading as www.agriemporium.co.za
          </p>
          <p>
            This electronic trading platform will be conducted within the
            framework of the rules listed below and other provisions that may
            be added by the administrator via e-mail or as posted on{' '}
            <a href="http://www.kraal.co.za">www.agriemporium.co.za</a>
          </p>
          <p>
            This website and the materials provided to you through it are
            protected by copyright, trade mark and other intellectual
            property rights and laws throughout the world. You may access and
            use this Website solely for the purposes of use connected with
            the Services.
          </p>
          <p>
            All contents of this Website including, but not limited to, the
            text, graphics, links and sounds are owned by Black Sheep
            Agribusiness (Pty) Ltd, also known as “LivestockAuctions” with may
            not be copied, downloaded, distributed or published in any way
            without their prior written consent, except that You may print,
            copy, download or temporarily store extracts for your personal
            information and transactions or when You use the Services. The
            Website is herein after referred to as either “Website” or
            “LivestockAuctions platform”.
          </p>
          <p>
            You are not permitted to use any trademarks or service marks
            whether registered or unregistered of LivestockAuctions or any
            _____________ Associates organizations without prior written
            consent.
          </p>
          <p>
            The Buyers, The Sellers and LivestockAuctions agree that the
            terms listed herein shall govern each and every online sale. In
            respect of each auction the Parties to the sale flowing from the
            auction is the Seller, LivestockAuctions and the successful
            Buyer.
          </p>
          <p>
            <b>1. Registration</b>
          </p>
          <p>
            <b>1.1 </b>
            Sellers, Buyers, Drivers and Inspectors are required to register
            as a user by completing the online "User Registration Page" on
            the Website and submitting it to LivestockAuctions. (“herein
            Users”) You agree to ensure that your registration details are
            true and accurate and to update any details when necessary via
            the Website.
          </p>
          <p>
            <b>1.2</b> All of the registration information a Buyer or
            Sellers provides to LivestockAuctions shall be current, complete
            and accurate. All Buyers must be 18 years of age or older. Users
            agree to not use any device, software or routine to interfere or
            attempt to interfere with the proper working of any transaction
            being conducted on and during any sale.
          </p>
          <p>
            <b>2. Ownership</b>
          </p>
          <p>
            In these terms and conditions, a Seller sells to
            LivestockAuctions and a Buyer buys from LivestockAuctions.
            Ownership passes from the Seller to LivestockAuctions and from
            LivestockAuctions to the Buyer as provided for herein.
          </p>
          <p>
            <b>3. Log-in security</b>
          </p>
          <p>
            <b>3.1</b> Users are solely responsible for keeping their
            personal username and password secure and confidential. You
            should not disclose your username or password to any other
            party. Once logged on you take full responsibility for
            transactions effected. If you believe that Your username and/or
            password has been compromised, or you are aware of any other
            breach of security regarding the LivestockAuctions platform, then
            you must notify LivestockAuctions immediately at
            admin@LivestockAuctions.co.za as a Buyer remains responsible for
            any purchase transactions placed under its buying number and
            password
          </p>
          <p>
            <b>4. Settlement of sales</b>
          </p>
          <p>
            <b>4.1</b> LivestockAuctions shall settle all Sellers to
            LivestockAuctions by electronic transfer of funds. All settlement
            of sales by Buyers shall be by means of electronic transfer to
            LivestockAuctions nominated account as depicted on
            LivestockAuctions Invoice.
          </p>
          <p>
            <b>5. VAT/ sales fee</b>
          </p>
          <p>
            All sales commission are subject to VAT. All purchases by
            LivestockAuctions from Sellers are subject to a 2.9% commission
            fee levied by LivestockAuctions against the sale through the
            LivestockAuctions on-line sales platform at
            www.LivestockAuctions.com (“the Website” or “the
            LivestockAuctions platform”)
          </p>
          <p>
            <b>6. Sales</b>
          </p>
          <p>
            <b>6.1</b> A Buyer shall pay for all purchases on loading and
            before removal. In such event ownership and risk passes FROM THE
            Seller to LivestockAuctions and from LivestockAuctions to the
            Buyer at the moment of removal, barring payment having been made.
          </p>
          <p>
            <b>6.2</b> The Driver will inspect livestock before loading and
            verify via the website or application. The Buyer must inspect
            the livestock upon arrival and verify via the website or
            application. If Buyer is relying on a third party to inspect
            livestock the Buyer shall be bound the terms of agreement as if
            Buyer had personally inspected the livestock.
          </p>
          <p>
            <b>7. Payment of Seller</b>
          </p>
          <p>
            LivestockAuctions shall pay all Sellers in respect of livestock
            purchased within 7 (seven) days of the removal date of the
            livestock, on condition that it has furnished LivestockAuctions
            with –
          </p>
          <p>
            <b>7.1 </b>
            The livestock has been successfully verified by the driver and
            buyer according to the information the seller has inputted
            through the website
          </p>
          <p>
            <b>7.2 </b>
            A health certificate issued by the state veterinarian or other
            authorised veterinarian, if applicable at the time of the sale.
          </p>
          <p>
            <b>7.3 </b>
            Weigh bridge slip if livestock is weighed on Weigh Bridge or
            other weighing method at or near Seller premises as agreed upon
            in advance before the sale takes place.
          </p>
          <p>
            <b>7.4</b> All documents to be loaded via the LivestockAuctions
            website or application
          </p>
          <p>
            <b>8. Insurance</b>
          </p>
          <p>
            Buyers shall at all times be responsible to insure livestock
            purchased for transit to Buyer premises from Seller premises.
          </p>
          <p>
            <b>9. Namibia / Botswana Sellers</b>
          </p>
          <p>
            <b>9.1</b> Sellers from Namibia and Botswana can load livestock
            for sale on the LivestockAuctions platform.
          </p>
          <p>
            <b>9.2</b> Additional documentation will apply for cross border
            purchases. The LivestockAuctions platform will charge an
            additional 2% to process the necessary documentation
          </p>
          <p>
            <b>9.3</b> Normal rates and charges apply for in country
            purchases and transactions
          </p>
          <p>
            <b>10</b>. Non-revocation of purchases
          </p>
          <p>
            <b>10.1</b> A buyer cannot renege on a transaction when it has
            successfully placed a bid. Any discrepancy in weight and quality
            of livestock upon arrival at Buyer shall be regulated by
            LivestockAuctions Standard Operating Procedure and the final
            price shall be adjusted in accordance with the terms of the SOP.
          </p>
          <p>
            LivestockAuctions shall have the right in its sole discretion, in
            extreme cases not amendable by the SOP, to cancel the
            transaction and return the livestock to the Seller at the
            Sellers expense.
          </p>
          <p>
            <b>10.2</b> Buyers need to familiarize them self with the weight
            and quality of livestock purchased before paying for the
            livestock. By accepting the livestock the Buyer accepts the
            correctness of the Lot purchased, as is.
          </p>
          <p>
            <b>11. Removal times</b>
          </p>
          <p>
            <b>11.1</b> The seller shall be responsible for making all
            arrangements with the Driver for merchandise pick-up.
          </p>
          <p>
            <b>11.2</b> The buyer shall be responsible for making
            arrangements with the Driver for livestock delivery times and
            verify location where livestock should be dropped off.
          </p>
          <p>
            <b>11.3</b> The usual maximum removal time after a successful
            auction is 5 (five) working days.
          </p>
          <p>
            <b>12. General</b>
          </p>
          <p>
            <b>12.1</b> LivestockAuctions reserves the right to, at its own
            discretion to change the commission structure for Buyers and
            Sellers.
          </p>
          <p>
            <b>12.2</b> a Seller listing livestock for sale on the
            LivestockAuctions platform can set required minimum price also
            referred to as the “reserve price”.
          </p>
          <p>
            <b>12.3</b> a Buyer agrees that the Online Auction work on a
            system where either the maximum value of a lot gets counted down
            automatically via predetermined decrements, to a lesser /
            reserve price, known as our Reverse Auction or where the maximum
            value (the sale price) of a lot is determined by prompting/asking
            for a higher/next bid within a predetermined time frame and
            predetermined increments. Individual internet speed of Buyers
            might mean that Buyers got beaten by another Buyer. This online
            auction works on a first come first served basis and
            LivestockAuctions’s designation of Buyer is final.
          </p>
          <p>
            <b>12.4</b> A Buyer acknowledges that all item/lots were
            available for video / photo inspection, prior to the sale and
            were satisfied. LivestockAuctions encourages Buyer to carefully
            inspect each Lot in which Buyer had any interest to determine the
            Lots` nature, quality, condition, sex percentages, quantity, size
            and grade.
          </p>
          <p>
            <b>12.5</b> All Buyers rely solely on their/its personal
            interpretation of information provided by LivestockAuctions`s
            Seller. Therefore, if the Buyer are unsure – Do not buy.
          </p>
          <p>
            <b>12.6</b> The Website User Agreement constitutes the final
            expression of the parties’ agreement and a complete and exclusive
            statement of the terms of the sale. The IMPLIED WARRANTIES OF
            MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, AND ALL
            OTHER WARRANTIES, EITHER EXPRESSED OR IMPLIED, ARE SPECIFICALLY
            EXCLUDED from this sale and transaction and shall NOT apply to
            the merchandise that is the subject of these sales.
          </p>
          <p>
            <b>12.7</b> LivestockAuctions does not have control over the
            item/lots that are posted on the Website / platform and cannot
            guarantee the authenticity and quality of said product posted by
            its Sellers, hence the remedies offered in the SOP, and as
            otherwise tabled herein.
          </p>
          <p>
            <b>12.8</b> LivestockAuctions gathers information about Buyers
            and Sellers for the purposes of the furtherance of economic
            activities on the LivestockAuctions platform only.
            LivestockAuctions will not sell, rent or otherwise disseminate
            this information. Buyers and Sellers use the LivestockAuctions
            platform at their own risk. LivestockAuctions takes every effort
            reasonably commercially viable to ensure a safe platform for
            Seller and Buyer to trade on. LivestockAuctions is not
            responsible for any losses, including loss of Seller and Buyer
            information, suffered due to LivestockAuctions platform failure
            or unlawful penetration thereof for any reasons, whatsoever, out
            of its control.
          </p>
          <p>
            <b>12.9</b> LivestockAuctions reserves the right to withdraw Lots
            listed for auction before the auction at its own discretion.
          </p>
          <p>
            <b>12.10</b> LivestockAuctions reserve the right to reject any
            and all bids / offers to buy in their sole discretion.
          </p>
          <p>
            <b>12.11</b> Buyer will be furnished an electronic receipt at
            the conclusion of the sale. Buyer must provide LivestockAuctions
            with Buyer’s current, correct e-mail address, phone number, and
            physical address.
          </p>
          <p>
            <b>12.12</b> Any livestock sold on the LivestockAuctions
            platform may become undeliverable by LivestockAuctions for
            reasons of, including but not limited to, theft, fire, storms,
            riots, acts of God, viz mayor etc. In such event
            LivestockAuctions shall be entitled to cancel the sale and
            restore the status quo ante and Buyer shall have no claim
            against LivestockAuctions for losses of any kind or whatsoever.
          </p>
          <p>
            <b>12.13</b> No adjustment will be made with regard to a Lot`s
            inventory by Seller after a successful sale.
          </p>
          <p>
            <b>12.14</b> LivestockAuctions cannot, and will not, be held
            responsible for any interruption in service, errors, and/or
            omissions in the functionality of the LivestockAuctions
            platform, caused by any means and does not guarantee continual,
            uninterrupted or error free service or use of the Website.
            Seller and Buyer acknowledge that auction sales are conducted
            electronically and rely on hardware and software that may
            malfunction without warning. LivestockAuctions, in its sole
            discretion, may void any sale, temporarily suspend buying and
            selling of livestock Lots that were affected by any malfunction.
            The decision of LivestockAuctions is final.
          </p>
          <p>
            <b>12.15</b> LivestockAuctions uses email mailing lists and sms
            lists to notify its customers/Users about online and live
            sales/Auctions. If you are receiving a particular mailing and
            wish to discontinue receiving future mailings, simply forward
            the received email to LivestockAuctions and request to have your
            name removed from our mailing list.
          </p>
          <p>
            <b>12.16</b> Users agree that they / it will not use any robot,
            spider, other automatic device, or manual process to monitor or
            copy the Website or the content contained herein without
            LivestockAuctions’s prior, express written permission. Nor will
            they use any device, software or routine to interfere or attempt
            to interfere with the proper working of the Website or any
            activity being conducted on the Website.
          </p>
          <p>
            You agree that you will not take any action that imposes an
            unreasonable or disproportionately large load on our
            infrastructure. You agree that you will not copy, reproduce,
            alter, modify, create derivative works, or publicly display any
            content from the Website without prior, express written
            permission of LivestockAuctions. THE WEBSITE IS PROVIDED ON AN
            “AS IS” BASIS WITHOUT WARRANTIES OF ANY KIND EITHER EXPRESSED OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF TITLE OR
            IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A
            PARTICULAR PURPOSE, OTHER THAN THOSE WARRANTIES WHICH ARE
            IMPOSED BY AND INCAPABLE OF EXCLUSION, RESTRICTION OR
            MODIFICATION UNDER THE LAWS APPLICABLE TO THIS AGREEMENT.
          </p>
          <p>
            <b>12.17</b> LivestockAuctions reserves the right to
            periodically change the terms and conditions of the Website and
            it is the Users` responsibility to periodically review any and
            all changes made to these terms and conditions prior to each use
            of this Website. By using this Website the User agree to accept
            all rules, terms, and conditions applicable at the time of use.
          </p>
          <p>
            <b>12.18</b> LivestockAuctions reserves the right, in its sole
            discretion, to ban any User from the Website
          </p>
          <p>
            <b>12.19</b> No legal advice is intended or implied by anything
            contained within the Site. No obligation, liability,
            responsibility, accountability or burden is undertaken, assumed
            or otherwise imposed by maintaining the Site.
          </p>
          <p>
            <b>12.20</b> Buyers, their agents, representatives, nominees or
            contractors enter Seller premises for purposes of removal of
            livestock sold at their own risk.
          </p>
          <p>
            <b>13. Breach</b>
          </p>
          <p>
            In the event of either of the Parties to this Agreement
            committing a breach of any of the terms and conditions hereof
            and remaining in default for a period of 10 (ten) days after
            receipt by it of written notice by email from the other Party
            calling for such breach to be remedied, the Party sending such
            notice shall be entitled, in addition to any other remedies it
            may have available in Law, either,
          </p>
          <p>
            <b>13.1</b> To cancel this agreement, or
          </p>
          <p>
            <b>13.2</b> To claim specific performance, and
          </p>
          <p>
            <b>13.3</b> In either instance to claim such damages from the
            other Party as it may have suffered together with Attorney’s
            fees on the scale as between Attorney and Client, including
            collection commission.
          </p>
          <p>
            <b>13.4</b> a Breach by a Buyer and the exercise of
            LivestockAuctions of its remedy as envisaged in paragraph 8.1
            hereof requires no notice.
          </p>
          <p>
            <b>14. Notice and Domicilium</b>
          </p>
          <p>
            <b>14.1</b> The Parties choose as domicilium citandi et
            executandi (“domicilium”) and for the delivery and service of
            all legal notices and process arising out of this Agreement or
            its termination / cancellation, or enforcement the email
            addresses –
          </p>
          <p>
            <b>14.1.1</b> Registered by Users during registration, and
          </p>
          <p>
            <b>14.1.2</b> in the event of LivestockAuctions –
            notice@LivestockAuctions.co.za
          </p>
          <p>
            <b>14.2</b> Either of the Parties shall be entitled from time to
            time, by written notice to the other, to vary its domicilium to
            any other email address.
          </p>
          <p>
            <b>14.3</b> Any notice required or permitted to be given in
            terms of this Agreement shall be valid and effective only if in
            writing and signed by or on behalf of the duly authorized
            representative of the notifying Party. For the purposes of this
            clause, notices shall include any notice in the form of a data
            message as defined in the Electronic Communications and
            Transactions Act, No. 25 of 2002, of South Africa.
          </p>
          <p>
            <b>14.4</b> Any notice which is sent by e-mail, shall be deemed,
            until the contrary is proved by the addressee, to have been
            received to have been received by the addressee on the day
            following the day of dispatch of the email.
          </p>
          <p>
            <b>14.5</b> Notwithstanding anything contained to the contrary
            in this Agreement, any notice written or otherwise actually
            received by one Party from the other Party shall be adequate
            notice to such Party.
          </p>
          <p>
            <b>15. Acceptance of terms and conditions</b>
          </p>
          <p>
            A Users` use of the Website / LivestockAuctions platform
            constitutes a complete and unconditional acceptance of the
            LivestockAuctions Terms and Conditions as set out herein and as
            amended from time to time.
          </p>
        </div>
      </div>
    </div>
  )
}
