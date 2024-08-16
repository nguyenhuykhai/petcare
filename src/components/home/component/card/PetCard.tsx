import React from "react";
import "./PetCard.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Chip, Grid } from "@mui/material";
import { Link } from "react-router-dom";

// {
//   "id": "85b20a7b-f819-4edf-928d-e755b6262278",
//   "name": "Sản phẩm 5",
//   "stockPrice": 1000000,
//   "sellingPrice": 1000000,
//   "description": "Sản phẩm 5",
//   "status": "Available",
//   "priority": null,
//   "category": {
//       "id": "7be29a8f-bf36-4e87-92db-82f465400272",
//       "name": "Mèo"
//   },
//   "image": []
// },
interface Pet {
  id: string;
  name: string;
  stockPrice: number;
  sellingPrice: number;
  description?: string;
  status: string;
  priority?: string;
  category: {
    id: string;
    name: string;
  };
  image: string[];
}

const PetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Card sx={{ maxWidth: 400, textAlign: "center" }}>
        <CardMedia
          sx={{ height: 200, objectFit: "cover" }}
          image={pet.image[0]}
          title={pet.name}
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontSize: "16px",
              height: "40px",
              color: "#272727",
              lineHeight: "20px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {pet.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#e67e22",
            }}
          >
            {pet.sellingPrice} VNĐ
          </Typography>
          <Chip
            label={pet.status === "Available" ? "Còn chỗ" : "Hết chỗ"}
            color={pet.status === "Available" ? "success" : "error"}
          />
        </CardContent>
        <CardActions sx={{ mb: 2 }}>
          <Link to={`/${pet.id}`} className="detail-button">
            <Button
              size="small"
              sx={{
                borderRadius: "5px",
                width: "120px",
                fontSize: "8px",
              }}
              variant="outlined"
              color="warning"
            >
              Xem chi tiết
            </Button>
          </Link>
          <Button
            size="small"
            sx={{
              borderRadius: "5px",
              width: "120px",
              fontSize: "8px",
            }}
            variant="contained"
            color="warning"
          >
            Đặt lịch
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default PetCard;
