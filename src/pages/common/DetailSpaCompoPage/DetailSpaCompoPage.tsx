import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import ProductAPI from "../../../utils/ProductAPI";
import { ComboType } from "../../../types/Combo/ComboType";
import LoadingComponentVersion2 from "../../../components/common/loading/Backdrop";

const DetailSpaCompoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [combo, setCombo] = useState<ComboType | null>(null);

  const defaultProductData: ComboType = {
    id: "N/A",
    name: "Combo không có sẵn",
    stockPrice: 0,
    sellingPrice: 0,
    description: "Mô tả combo không có sẵn.",
    status: "Unavailable",
    priority: null,
    category: {
      id: "N/A",
      name: "Chưa xác định",
    },
    supProducts: [],
    image: [
      {
        imageURL:
          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      },
    ],
  };

  useEffect(() => {
    const fetchCombo = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const response = await ProductAPI.getDetail(id);
          const comboData: ComboType = response;

          // Set fallback data if some fields are missing
          const comboWithDefaults = {
            ...defaultProductData,
            ...comboData,
            category: {
              ...defaultProductData.category,
              ...comboData.category,
            },
            image:
              comboData.image.length > 0
                ? comboData?.image[0]?.imageURL
                : defaultProductData.image[0].imageURL,
          };

          setCombo(comboWithDefaults);
        }
      } catch (error) {
        console.error("Failed to fetch combo details", error);
        setCombo(defaultProductData); // Set default data in case of an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCombo();
  }, [id]);

  if (isLoading) {
    return <LoadingComponentVersion2 open={isLoading} />;
  }

  if (!combo) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h5">Combo không tìm thấy</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              alt={combo.name}
              height="300"
              image={combo.image[0]}
              title={combo.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {combo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {combo.description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Giá: {combo.sellingPrice.toLocaleString()} VND
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tình trạng: {combo.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Danh mục: {combo.category.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Sản phẩm trong combo
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {combo.supProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={product.name}
                    height="150"
                    image={
                      product.image.length
                        ? product.image[0]
                        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    }
                    title={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Giá: {product.sellingPrice.toLocaleString()} VND
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailSpaCompoPage;
