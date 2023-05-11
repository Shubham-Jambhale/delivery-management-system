import { LoadScript } from '@react-google-maps/api';
import react from 'react';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from './paymentForm';

const PUBLIC_KEY="pk_test_51MweU9DZWei9mX2RsO3qV9NGHeErVn4KavXPk28GT2Fxeyx5YWIPeqPeTssMoliVb2EalInNLiEYRzHliU0BJFAt00Lcxnpa9B"
const stripeTest = loadStripe(PUBLIC_KEY)

export default function stripeContainer(){
    return(
        <Elements stripe={stripeTest}>
            <PaymentForm/>


        </Elements>
    )
}
