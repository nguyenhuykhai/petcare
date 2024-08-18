import React, { useCallback, useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CardMedia, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import FeaturedTitle from "../../../components/common/highlight/FeaturedTitle";
import ProductAPI from "../../../utils/ProductAPI";
import { ComboType, ComboResponse } from "../../../types/Combo/ComboType";
import "./SpaCompoPage.css";
import PetImageGallery from "../../../components/home/component/gallery/PetImageGallery";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";

const SpaCompoPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [comboList, setComboList] = useState<ComboType[]>([]);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });

  const fetchAllCombos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: ComboResponse = await ProductAPI.getAll(filter);
      setComboList(data.items);
    } catch (error: any) {
      console.error("Error fetching combo spa data", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAllCombos();
  }, [fetchAllCombos]);

  const defaultImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  return (
    <div className="container">
      <LoadingComponentVersion2 open={isLoading} />
      <FeaturedTitle title={"Dịch Vụ Spa - Grooming"} subtitle={"Các gói combo spa cho thú cưng"} />

      <Grid container spacing={3}>
        {comboList.map((combo) => (
          <Grid item xs={12} sm={6} md={4} key={combo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={combo.image.length ? combo?.image[0]?.imageURL : defaultImage}
                alt={combo.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {combo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {combo.description}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                  Giá: {combo.sellingPrice.toLocaleString()} VND
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/spa-services/${combo.id}`}  // Use Link to navigate
                >
                  Xem chi tiết
                </Button>
                <Button size="small" variant="outlined" color="primary">
                  Đặt lịch
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <FeaturedTitle
        title={"KHOẢNH KHẮC THÚ CƯNG"}
        subtitle={"PET LIKE US AND SO WILL YOU"}
      />
      <PetImageGallery />
    </div>
  );
};

export default SpaCompoPage;