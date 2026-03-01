// // src/pages/user/BookSlot.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Skeleton,
//   Alert,
//   Snackbar,
//   useTheme,
//   Divider,
//   InputAdornment,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {
//   Search as SearchIcon,
//   LocalParking as ParkingIcon,
//   AccessTime as TimeIcon,
//   DirectionsCar as CarIcon,
//   AttachMoney as MoneyIcon,
//   CheckCircle as CheckIcon,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import parkingService from "../../services/parkingService";
// import bookingService from "../../services/bookingService";
// import paymentService from "../../services/paymentService";
// import {
//   connectSocket,
//   joinParkingRoom,
//   onSlotUpdate,
//   disconnectSocket,
// } from "../../services/socketService";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// // Styled components (keep as is)
// const StyledCard = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.text.secondary,
//   height: "100%",
//   transition: "transform 0.2s, box-shadow 0.2s",
//   cursor: "pointer",
//   "&:hover": {
//     transform: "translateY(-4px)",
//     boxShadow: theme.shadows[8],
//   },
//   "&.selected": {
//     border: `2px solid ${theme.palette.primary.main}`,
//     boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
//   },
// }));

// const SlotCard = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.text.secondary,
//   padding: theme.spacing(2),
//   textAlign: "center",
//   transition: "all 0.2s",
//   cursor: "pointer",
//   "&:hover": {
//     transform: "scale(1.02)",
//     boxShadow: theme.shadows[4],
//   },
//   "&.selected": {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.text.primary,
//     "& .MuiTypography-root": {
//       color: theme.palette.text.primary,
//     },
//   },
//   "&.unavailable": {
//     opacity: 0.5,
//     cursor: "not-allowed",
//     pointerEvents: "none",
//   },
// }));

// const steps = [
//   "Select Parking",
//   "Select Date & Time",
//   "Choose Slot",
//   "Review & Confirm",
//   "Payment",
// ];

// // Separate component for payment form that uses Stripe hooks
// const PaymentForm = ({ clientSecret, total, onSuccess, onError }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setProcessing(true);
//     const { error: submitError } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/user/bookings`,
//       },
//     });

//     if (submitError) {
//       setError(submitError.message);
//       onError?.(submitError.message);
//       setProcessing(false);
//     } else {
//       onSuccess?.();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={!stripe || processing}
//         >
//           {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
//         </Button>
//       </Box>
//       {error && (
//         <Alert severity="error" sx={{ mt: 2 }}>
//           {error}
//         </Alert>
//       )}
//     </form>
//   );
// };

// const BookSlot = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // Step state
//   const [activeStep, setActiveStep] = useState(0);

//   // Parking selection
//   const [parkings, setParkings] = useState([]);
//   const [selectedParking, setSelectedParking] = useState(null);
//   const [parkingLoading, setParkingLoading] = useState(true);
//   const [searchCity, setSearchCity] = useState("");

//   // Date & time
//   const [dateTime, setDateTime] = useState({
//     date: new Date().toISOString().split("T")[0],
//     startTime: "10:00",
//     endTime: "12:00",
//   });

//   // Slots
//   const [slots, setSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [slotLoading, setSlotLoading] = useState(false);

//   // Booking details
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [notes, setNotes] = useState("");

//   // Coupon
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [couponError, setCouponError] = useState("");
//   const [couponLoading, setCouponLoading] = useState(false);

//   // Payment
//   const [bookingId, setBookingId] = useState(null);
//   const [clientSecret, setClientSecret] = useState("");
//   const [paymentError, setPaymentError] = useState("");
//   const [paymentProcessing, setPaymentProcessing] = useState(false);

//   // UI state
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [bookingLoading, setBookingLoading] = useState(false);

//   useEffect(() => {
//     fetchParkings();
//   }, []);

//   useEffect(() => {
//     if (selectedParking && activeStep === 2) {
//       fetchAvailableSlots();
//     }
//   }, [selectedParking, dateTime, activeStep]);

//   // Real-time socket for slot updates
//   useEffect(() => {
//     if (selectedParking) {
//       connectSocket();
//       joinParkingRoom(selectedParking._id);
//       onSlotUpdate((updatedSlot) => {
//         setSlots((prevSlots) =>
//           prevSlots.map((s) => (s._id === updatedSlot._id ? updatedSlot : s)),
//         );
//       });
//     }
//     return () => disconnectSocket();
//   }, [selectedParking]);

//   const fetchParkings = async () => {
//     try {
//       setParkingLoading(true);
//       const res = await parkingService.getAllParkings({ city: searchCity });
//       setParkings(res.data || res);
//     } catch (err) {
//       setError(err.message || "Failed to load parkings");
//     } finally {
//       setParkingLoading(false);
//     }
//   };

//   const fetchAvailableSlots = async () => {
//     if (!selectedParking) return;
//     setSlotLoading(true);
//     try {
//       const res = await parkingService.checkSlotAvailability(
//         selectedParking._id,
//         {
//           date: dateTime.date,
//           startTime: dateTime.startTime,
//           endTime: dateTime.endTime,
//         },
//       );
//       setSlots(res.data || res);
//     } catch (err) {
//       setError(err.message || "Failed to check availability");
//     } finally {
//       setSlotLoading(false);
//     }
//   };

//   const calculateDuration = () => {
//     if (!dateTime.startTime || !dateTime.endTime) return 0;
//     const start = new Date(`2000-01-01T${dateTime.startTime}`);
//     const end = new Date(`2000-01-01T${dateTime.endTime}`);
//     return (end - start) / (1000 * 60 * 60);
//   };

//   const calculateSubtotal = () => {
//     if (!selectedSlot) return 0;
//     const hours = calculateDuration();
//     return hours * (selectedSlot.pricePerHour || 0);
//   };

//   const calculateTotal = () => {
//     const subtotal = calculateSubtotal();
//     if (appliedCoupon) {
//       return appliedCoupon.finalAmount;
//     }
//     return subtotal;
//   };

//   const handleParkingSelect = (parking) => {
//     setSelectedParking(parking);
//     setActiveStep(1);
//   };

//   const handleDateTimeNext = () => {
//     if (!dateTime.date || !dateTime.startTime || !dateTime.endTime) {
//       setError("Please fill all date/time fields");
//       return;
//     }
//     if (dateTime.startTime >= dateTime.endTime) {
//       setError("End time must be after start time");
//       return;
//     }
//     setError("");
//     setActiveStep(2);
//   };

//   const handleSlotSelect = (slot) => {
//     setSelectedSlot(slot);
//   };

//   const handleSlotNext = () => {
//     if (!selectedSlot) {
//       setError("Please select a slot");
//       return;
//     }
//     setError("");
//     setActiveStep(3);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//     setError("");
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) return;
//     setCouponLoading(true);
//     setCouponError("");
//     setAppliedCoupon(null);
//     try {
//       const bookingAmount = calculateSubtotal();
//       const res = await bookingService.validateCoupon(
//         couponCode,
//         selectedParking._id,
//         bookingAmount,
//       );
//       setAppliedCoupon(res.data);
//     } catch (err) {
//       setCouponError(err.message || "Invalid coupon");
//     } finally {
//       setCouponLoading(false);
//     }
//   };

//   const handleConfirmBooking = async () => {
//     if (!vehicleNumber.trim()) {
//       setError("Vehicle number is required");
//       return;
//     }
//     setBookingLoading(true);
//     setError("");
//     try {
//       const bookingData = {
//         parkingId: selectedParking._id,
//         slotId: selectedSlot._id,
//         startTime: `${dateTime.date}T${dateTime.startTime}`,
//         endTime: `${dateTime.date}T${dateTime.endTime}`,
//         vehicleNumber,
//         notes,
//       };
//       if (appliedCoupon) {
//         bookingData.couponId = appliedCoupon.coupon._id;
//         bookingData.discountAmount = appliedCoupon.discountAmount;
//       }
//       const response = await bookingService.createBooking(bookingData);
//       const newBookingId = response.data._id;
//       setBookingId(newBookingId);

//       // Create payment intent
//       const paymentRes = await paymentService.createPaymentIntent({
//         bookingId: newBookingId,
//       });
//       setClientSecret(paymentRes.clientSecret);
//       setActiveStep(4); // Move to payment step
//     } catch (err) {
//       if (err.response?.status === 409) {
//         setError(
//           "This slot is no longer available. Please select another slot.",
//         );
//         // Refresh slots so the user can pick a new one
//         fetchAvailableSlots();
//       } else {
//         setError(err.message || "Booking failed");
//       }
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         // ... (unchanged)
//         return (
//           <Box>
//             <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Search by city"
//                 value={searchCity}
//                 onChange={(e) => setSearchCity(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               <Button variant="contained" onClick={fetchParkings}>
//                 Search
//               </Button>
//             </Box>

//             {parkingLoading ? (
//               <Grid container spacing={3}>
//                 {[...Array(6)].map((_, i) => (
//                   <Grid item xs={12} sm={6} md={4} key={i}>
//                     <Skeleton variant="rectangular" height={200} />
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : parkings.length === 0 ? (
//               <Alert severity="info">
//                 No parking lots found. Try a different city.
//               </Alert>
//             ) : (
//               <Grid container spacing={3}>
//                 {parkings.map((parking) => (
//                   <Grid item xs={12} sm={6} md={4} key={parking._id}>
//                     <StyledCard
//                       className={
//                         selectedParking?._id === parking._id ? "selected" : ""
//                       }
//                       onClick={() => handleParkingSelect(parking)}
//                     >
//                       <CardContent>
//                         <Typography variant="h6" gutterBottom>
//                           {parking.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {parking.address}, {parking.city}
//                         </Typography>
//                         <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//                           <Chip
//                             icon={<ParkingIcon />}
//                             label={`${parking.totalSlots || 0} slots`}
//                             size="small"
//                           />
//                           <Chip
//                             icon={<MoneyIcon />}
//                             label={`$${parking.pricePerHour}/hr`}
//                             size="small"
//                           />
//                         </Box>
//                       </CardContent>
//                     </StyledCard>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}
//           </Box>
//         );

//       case 1:
//         // ... (unchanged)
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Selected Parking: {selectedParking?.name}
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="Date"
//                   type="date"
//                   value={dateTime.date}
//                   onChange={(e) =>
//                     setDateTime({ ...dateTime, date: e.target.value })
//                   }
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="Start Time"
//                   type="time"
//                   value={dateTime.startTime}
//                   onChange={(e) =>
//                     setDateTime({ ...dateTime, startTime: e.target.value })
//                   }
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="End Time"
//                   type="time"
//                   value={dateTime.endTime}
//                   onChange={(e) =>
//                     setDateTime({ ...dateTime, endTime: e.target.value })
//                   }
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//         );

//       case 2:
//         // ... (unchanged)
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Available Slots for {selectedParking?.name} on {dateTime.date}
//             </Typography>
//             {slotLoading ? (
//               <Grid container spacing={2}>
//                 {[...Array(8)].map((_, i) => (
//                   <Grid item xs={6} sm={4} md={3} key={i}>
//                     <Skeleton variant="rectangular" height={100} />
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : slots.length === 0 ? (
//               <Alert severity="warning">
//                 No slots available for the selected time.
//               </Alert>
//             ) : (
//               <Grid container spacing={2}>
//                 {slots.map((slot) => (
//                   <Grid item xs={6} sm={4} md={3} key={slot._id}>
//                     <SlotCard
//                       className={
//                         selectedSlot?._id === slot._id ? "selected" : ""
//                       }
//                       onClick={() => handleSlotSelect(slot)}
//                     >
//                       <Typography variant="h6">{slot.slotNumber}</Typography>
//                       <Typography variant="body2">{slot.type}</Typography>
//                       <Typography variant="body2" fontWeight={600}>
//                         ${slot.pricePerHour}/hr
//                       </Typography>
//                       <Chip
//                         size="small"
//                         label={slot.status}
//                         color={
//                           slot.status === "available" ? "success" : "default"
//                         }
//                         sx={{ mt: 1 }}
//                       />
//                     </SlotCard>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}
//           </Box>
//         );

//       case 3:
//         // ... (unchanged)
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Review Your Booking
//             </Typography>

//             {/* Booking Summary */}
//             <Paper sx={{ p: 3, mb: 3 }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Parking
//                   </Typography>
//                   <Typography variant="body1">
//                     {selectedParking?.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {selectedParking?.address}, {selectedParking?.city}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Slot
//                   </Typography>
//                   <Typography variant="body1">
//                     {selectedSlot?.slotNumber} ({selectedSlot?.type})
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     ${selectedSlot?.pricePerHour}/hr
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Date & Time
//                   </Typography>
//                   <Typography variant="body1">{dateTime.date}</Typography>
//                   <Typography variant="body2">
//                     {dateTime.startTime} - {dateTime.endTime}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Duration
//                   </Typography>
//                   <Typography variant="body1">
//                     {calculateDuration().toFixed(1)} hours
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 2 }} />
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Typography variant="subtitle1">Subtotal</Typography>
//                     <Typography variant="subtitle1">
//                       ${calculateSubtotal().toFixed(2)}
//                     </Typography>
//                   </Box>
//                   {appliedCoupon && (
//                     <>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography variant="subtitle1">Discount</Typography>
//                         <Typography variant="subtitle1" color="success.main">
//                           -${appliedCoupon.discountAmount.toFixed(2)}
//                         </Typography>
//                       </Box>
//                       <Divider sx={{ my: 1 }} />
//                     </>
//                   )}
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Typography variant="h6">Total</Typography>
//                     <Typography variant="h6" color="primary">
//                       ${calculateTotal().toFixed(2)}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {/* Coupon */}
//             <Paper sx={{ p: 3, mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Apply Coupon
//               </Typography>
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Enter coupon code"
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                   disabled={!!appliedCoupon}
//                 />
//                 {!appliedCoupon ? (
//                   <Button
//                     variant="outlined"
//                     onClick={handleApplyCoupon}
//                     disabled={couponLoading}
//                   >
//                     Apply
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => {
//                       setAppliedCoupon(null);
//                       setCouponCode("");
//                       setCouponError("");
//                     }}
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </Box>
//               {couponError && (
//                 <Alert severity="error" sx={{ mt: 1 }}>
//                   {couponError}
//                 </Alert>
//               )}
//               {appliedCoupon && (
//                 <Alert severity="success" sx={{ mt: 1 }}>
//                   Coupon applied! You saved $
//                   {appliedCoupon.discountAmount.toFixed(2)}.
//                 </Alert>
//               )}
//             </Paper>

//             {/* Additional Details */}
//             <Typography variant="h6" gutterBottom>
//               Additional Details
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Vehicle Number"
//                   value={vehicleNumber}
//                   onChange={(e) => setVehicleNumber(e.target.value)}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Notes (optional)"
//                   multiline
//                   rows={3}
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//         );

//       case 4:
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Complete Payment
//             </Typography>
//             {clientSecret ? (
//               <Elements stripe={stripePromise} options={{ clientSecret }}>
//                 <PaymentForm
//                   total={calculateTotal()}
//                   onSuccess={() => {
//                     // Optional: handle success (redirect or show message)
//                   }}
//                   onError={(msg) => setPaymentError(msg)}
//                 />
//               </Elements>
//             ) : (
//               <Alert severity="info">Preparing payment...</Alert>
//             )}
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
//         Book a Slot
//       </Typography>

//       <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }}>
//           {success}
//         </Alert>
//       )}

//       <Paper sx={{ p: 4 }}>
//         {renderStepContent(activeStep)}

//         {activeStep < steps.length - 1 && (
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//             <Button
//               variant="outlined"
//               onClick={handleBack}
//               disabled={activeStep === 0 || bookingLoading}
//             >
//               Back
//             </Button>
//             {activeStep === steps.length - 2 ? (
//               <Button
//                 variant="contained"
//                 onClick={handleConfirmBooking}
//                 disabled={bookingLoading}
//                 startIcon={<CheckIcon />}
//               >
//                 {bookingLoading ? "Confirming..." : "Confirm Booking"}
//               </Button>
//             ) : (
//               <Button
//                 variant="contained"
//                 onClick={
//                   activeStep === 1
//                     ? handleDateTimeNext
//                     : activeStep === 2
//                       ? handleSlotNext
//                       : () => setActiveStep(activeStep + 1)
//                 }
//                 disabled={
//                   (activeStep === 2 && slotLoading) ||
//                   (activeStep === 2 && slots.length === 0)
//                 }
//               >
//                 Next
//               </Button>
//             )}
//           </Box>
//         )}
//       </Paper>
//     </Container>
//   );
// };

// export default BookSlot;






// src/pages/user/BookSlot.jsx (without Stripe)
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Alert,
  Snackbar,
  useTheme,
  Divider,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  LocalParking as ParkingIcon,
  AccessTime as TimeIcon,
  DirectionsCar as CarIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import parkingService from "../../services/parkingService";
import bookingService from "../../services/bookingService";
import {
  connectSocket,
  joinParkingRoom,
  onSlotUpdate,
  disconnectSocket,
} from "../../services/socketService";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  height: "100%",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
  "&.selected": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
  },
}));

const SlotCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  textAlign: "center",
  transition: "all 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[4],
  },
  "&.selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    "& .MuiTypography-root": {
      color: theme.palette.text.primary,
    },
  },
  "&.unavailable": {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
  },
}));

const steps = [
  "Select Parking",
  "Select Date & Time",
  "Choose Slot",
  "Review & Confirm",
]; // Removed Payment step

const BookSlot = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Step state
  const [activeStep, setActiveStep] = useState(0);

  // Parking selection
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [parkingLoading, setParkingLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");

  // Date & time
  const [dateTime, setDateTime] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
  });

  // Slots
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotLoading, setSlotLoading] = useState(false);

  // Booking details
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchParkings();
  }, []);

  useEffect(() => {
    if (selectedParking && activeStep === 2) {
      fetchAvailableSlots();
    }
  }, [selectedParking, dateTime, activeStep]);

  // Real-time socket for slot updates
  useEffect(() => {
    if (selectedParking) {
      connectSocket();
      joinParkingRoom(selectedParking._id);
      onSlotUpdate((updatedSlot) => {
        setSlots((prevSlots) =>
          prevSlots.map((s) => (s._id === updatedSlot._id ? updatedSlot : s)),
        );
      });
    }
    return () => disconnectSocket();
  }, [selectedParking]);

  const fetchParkings = async () => {
    try {
      setParkingLoading(true);
      const res = await parkingService.getAllParkings({ city: searchCity });
      setParkings(res.data || res);
    } catch (err) {
      setError(err.message || "Failed to load parkings");
    } finally {
      setParkingLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedParking) return;
    setSlotLoading(true);
    try {
      const res = await parkingService.checkSlotAvailability(
        selectedParking._id,
        {
          date: dateTime.date,
          startTime: dateTime.startTime,
          endTime: dateTime.endTime,
        },
      );
      setSlots(res.data || res);
    } catch (err) {
      setError(err.message || "Failed to check availability");
    } finally {
      setSlotLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!dateTime.startTime || !dateTime.endTime) return 0;
    const start = new Date(`2000-01-01T${dateTime.startTime}`);
    const end = new Date(`2000-01-01T${dateTime.endTime}`);
    return (end - start) / (1000 * 60 * 60);
  };

  const calculateSubtotal = () => {
    if (!selectedSlot) return 0;
    const hours = calculateDuration();
    return hours * (selectedSlot.pricePerHour || 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (appliedCoupon) {
      return appliedCoupon.finalAmount;
    }
    return subtotal;
  };

  const handleParkingSelect = (parking) => {
    setSelectedParking(parking);
    setActiveStep(1);
  };

  const handleDateTimeNext = () => {
    if (!dateTime.date || !dateTime.startTime || !dateTime.endTime) {
      setError("Please fill all date/time fields");
      return;
    }
    if (dateTime.startTime >= dateTime.endTime) {
      setError("End time must be after start time");
      return;
    }
    setError("");
    setActiveStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSlotNext = () => {
    if (!selectedSlot) {
      setError("Please select a slot");
      return;
    }
    setError("");
    setActiveStep(3);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setAppliedCoupon(null);
    try {
      const bookingAmount = calculateSubtotal();
      const res = await bookingService.validateCoupon(
        couponCode,
        selectedParking._id,
        bookingAmount,
      );
      setAppliedCoupon(res.data);
    } catch (err) {
      setCouponError(err.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!vehicleNumber.trim()) {
      setError("Vehicle number is required");
      return;
    }
    setBookingLoading(true);
    setError("");
    try {
      const bookingData = {
        parkingId: selectedParking._id,
        slotId: selectedSlot._id,
        startTime: `${dateTime.date}T${dateTime.startTime}`,
        endTime: `${dateTime.date}T${dateTime.endTime}`,
        vehicleNumber,
        notes,
      };
      if (appliedCoupon) {
        bookingData.couponId = appliedCoupon.coupon._id;
        bookingData.discountAmount = appliedCoupon.discountAmount;
      }
      await bookingService.createBooking(bookingData);
      setSuccess("Booking confirmed! Redirecting to My Bookings...");
      setTimeout(() => navigate("/user/bookings"), 2000);
    } catch (err) {
      setError(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={fetchParkings}>
                Search
              </Button>
            </Box>

            {parkingLoading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))}
              </Grid>
            ) : parkings.length === 0 ? (
              <Alert severity="info">
                No parking lots found. Try a different city.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {parkings.map((parking) => (
                  <Grid item xs={12} sm={6} md={4} key={parking._id}>
                    <StyledCard
                      className={
                        selectedParking?._id === parking._id ? "selected" : ""
                      }
                      onClick={() => handleParkingSelect(parking)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {parking.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {parking.address}, {parking.city}
                        </Typography>
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                          <Chip
                            icon={<ParkingIcon />}
                            label={`${parking.totalSlots || 0} slots`}
                            size="small"
                          />
                          <Chip
                            icon={<MoneyIcon />}
                            label={`$${parking.pricePerHour}/hr`}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selected Parking: {selectedParking?.name}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={dateTime.date}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={dateTime.startTime}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, startTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={dateTime.endTime}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, endTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Slots for {selectedParking?.name} on {dateTime.date}
            </Typography>
            {slotLoading ? (
              <Grid container spacing={2}>
                {[...Array(8)].map((_, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Skeleton variant="rectangular" height={100} />
                  </Grid>
                ))}
              </Grid>
            ) : slots.length === 0 ? (
              <Alert severity="warning">
                No slots available for the selected time.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {slots.map((slot) => (
                  <Grid item xs={6} sm={4} md={3} key={slot._id}>
                    <SlotCard
                      className={
                        selectedSlot?._id === slot._id ? "selected" : ""
                      }
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <Typography variant="h6">{slot.slotNumber}</Typography>
                      <Typography variant="body2">{slot.type}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${slot.pricePerHour}/hr
                      </Typography>
                      <Chip
                        size="small"
                        label={slot.status}
                        color={
                          slot.status === "available" ? "success" : "default"
                        }
                        sx={{ mt: 1 }}
                      />
                    </SlotCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Booking
            </Typography>

            {/* Booking Summary */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Parking
                  </Typography>
                  <Typography variant="body1">
                    {selectedParking?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedParking?.address}, {selectedParking?.city}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Slot
                  </Typography>
                  <Typography variant="body1">
                    {selectedSlot?.slotNumber} ({selectedSlot?.type})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${selectedSlot?.pricePerHour}/hr
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">{dateTime.date}</Typography>
                  <Typography variant="body2">
                    {dateTime.startTime} - {dateTime.endTime}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {calculateDuration().toFixed(1)} hours
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Subtotal</Typography>
                    <Typography variant="subtitle1">
                      ${calculateSubtotal().toFixed(2)}
                    </Typography>
                  </Box>
                  {appliedCoupon && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle1">Discount</Typography>
                        <Typography variant="subtitle1" color="success.main">
                          -${appliedCoupon.discountAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </>
                  )}
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Coupon */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Apply Coupon
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                      setCouponError("");
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              {couponError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {couponError}
                </Alert>
              )}
              {appliedCoupon && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Coupon applied! You saved $
                  {appliedCoupon.discountAmount.toFixed(2)}.
                </Alert>
              )}
            </Paper>

            {/* Additional Details */}
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (optional)"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Book a Slot
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        {renderStepContent(activeStep)}

        {activeStep === steps.length - 1 ? (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmBooking}
              disabled={bookingLoading}
              startIcon={<CheckIcon />}
            >
              {bookingLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={
                activeStep === 1
                  ? handleDateTimeNext
                  : activeStep === 2
                    ? handleSlotNext
                    : () => setActiveStep(activeStep + 1)
              }
              disabled={
                (activeStep === 2 && slotLoading) ||
                (activeStep === 2 && slots.length === 0)
              }
            >
              Next
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookSlot;
