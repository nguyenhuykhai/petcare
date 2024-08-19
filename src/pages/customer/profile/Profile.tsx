import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { orange, green, red, grey } from "@mui/material/colors";
import petAPI from "../../../utils/PetAPI";
import bookingAPI from "../../../utils/BookingAPI";
import { toast } from "react-toastify";
import { set } from "date-fns";

const Profile: React.FC = () => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const [view, setView] = useState<"pets" | "bookings">("bookings");
  const [petList, setPetList] = useState<any[]>([]);
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchPetList = async () => {
      try {
        const response = await petAPI.getPetsByCustomerId(userData.id);
        setPetList(response.items);
      } catch (error) {
        console.error("Error fetching pet list:", error);
      }
    };
    fetchPetList();
  }, [userData.id]);

  useEffect(() => {
    const fetchBookingList = async () => {
      try {
        const response: any = await bookingAPI.getBookingsByCustomerId(
          userData.id
        );
        setBookingList(response.items);
      } catch (error) {
        console.error("Error fetching booking list:", error);
      }
    };
    fetchBookingList();
  }, [userData.id, reload]);

  useEffect(() => {
    if (openStaffDialog) {
      const fetchStaffList = async () => {
        try {
          const response = await bookingAPI.getStaffList();
          setStaffList(
            response.items.filter((staff: any) => staff.status === "ACTIVE")
          );
        } catch (error) {
          console.error("Error fetching staff list:", error);
        }
      };
      fetchStaffList();
    }
  }, [openStaffDialog]);

  const handleDeleteClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrderId) {
      try {
        await bookingAPI.updateOrderStatus(selectedOrderId, {
          status: "CANCELED",
          note: cancelNote,
          description: cancelDescription,
          staffId: userData.id,
        });
        toast.success("Order canceled successfully!");
        setReload(!reload);
        setBookingList((prev) =>
          prev.filter((booking) => booking.orderId !== selectedOrderId)
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Error canceling order:", error);
        toast.error("Failed to cancel order.");
      }
    }
  };

  const handleUpdateOrder = (booking: any) => {
    if (booking.status === "UNPAID") {
      setSelectedOrderId(booking.orderId);
      setOpenStaffDialog(true);
    }
  };

  const handleConfirmChangeStaff = async () => {
    if (selectedOrderId && selectedStaffId) {
      try {
        const response: any = await bookingAPI.updateOrderStatus(selectedOrderId, {
          status: "UNPAID", // or keep the existing status if you're only updating the staff
          note: cancelNote,
          description: cancelDescription,
          staffId: selectedStaffId,
        });
        if (response === "Đơn hàng cập nhật thất bại") {
          toast.error("Đơn hàng cập nhật thất bại! Vui lòng thử lại sau.");
        } else {
          toast.success("Nhân viên đã được đổi thành công!");
          setReload(!reload);
          setOpenStaffDialog(false);
        }
      } catch (error) {
        console.error("Error updating order staff:", error);
        toast.error("Nhân viên đã cập nhật thất bại!");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
    setCancelNote("");
    setCancelDescription("");
  };

  const handleCloseStaffDialog = () => {
    setOpenStaffDialog(false);
    setSelectedStaffId("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNPAID":
        return orange[500];
      case "PAID":
        return green[500];
      case "COMPLETED":
        return grey[700];
      case "CANCELED":
        return red[500];
      default:
        return grey[700];
    }
  };

  const convertTypeToText = (type: string) => {
    switch (type) {
      case "UNPAID":
        return "Chưa thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginY: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box sx={{ backgroundColor: "#e89305", p: 2, borderRadius: 1 }}>
            <Typography variant="h6" color="white">
              Danh mục
            </Typography>
            <List component="nav">
              <ListItem button onClick={() => setView("bookings")}>
                <ListItemText
                  sx={{ color: "white" }}
                  primary="Đơn hàng của tôi"
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          {view === "bookings" && (
            <Box>
              <Typography variant="h4" gutterBottom>
                Đơn hàng của tôi
              </Typography>
              <List>
                {bookingList.map((booking) => (
                  <React.Fragment key={booking.orderId}>
                    <ListItem alignItems="flex-start">
                      <Avatar
                        alt={booking.petInfor.name}
                        src={booking.petInfor.image}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                          {booking.petInfor.name} - {booking.invoiceCode}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Ghi chú: {booking.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: getStatusColor(booking.status) }}
                        >
                          Trạng thái: {convertTypeToText(booking.status)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Nhân viên chăm sóc: {booking?.staff?.fullName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Tổng tiền: {booking.finalAmount.toLocaleString()} VND
                        </Typography>
                      </Box>
                      <Box>
                        {booking.status === "CANCELED" ? (
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ mr: 1 }}
                            onClick={() => toast.info("Đơn hàng đã bị hủy!")}
                          >
                            Hủy
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ mr: 1 }}
                            onClick={() => handleDeleteClick(booking.orderId)}
                          >
                            Hủy
                          </Button>
                        )}

                        {booking.status === "UNPAID" ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUpdateOrder(booking)}
                          >
                            Đổi nhân viên
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              toast.info("Đơn hàng quá thời hạn cập nhật!")
                            }
                          >
                            Đổi nhân viên
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Dialog for Canceling Order */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Hủy Đơn Hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng nhập ghi chú và mô
            tả lý do hủy.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú"
            fullWidth
            variant="standard"
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            variant="standard"
            value={cancelDescription}
            onChange={(e) => setCancelDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Changing Staff */}
      <Dialog open={openStaffDialog} onClose={handleCloseStaffDialog}>
        <DialogTitle>Đổi Nhân Viên</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng chọn nhân viên mới cho đơn hàng này.
          </DialogContentText>
          <RadioGroup
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            {staffList.map((staff) => (
              <FormControlLabel
                key={staff.id}
                value={staff.id}
                control={<Radio />}
                label={staff.fullName}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStaffDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirmChangeStaff} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;