import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect, useState} from "react";
import {Input, Button, Header} from 'react-native-elements';
import ApiClient from "./service/apiClient";

export default function App() {

    const [userNameAndPassword, setUsernameAndPassword] = useState(undefined);
    const [jwt, setJwt] = useState(undefined);
    const [loginError, setLoginError] = useState(false);

    const [stocks, setStocks] = useState(undefined);
    const [stores, setStores] = useState(undefined);
    const [products, setProducts] = useState(undefined);

    useEffect(() => {
        if (jwt) {
            ApiClient.getAllProducts(jwt)
                .then((allProductsResponse) => setProducts(allProductsResponse.data))
                .then(() => {
                    ApiClient.getAllStores(jwt)
                        .then((allStoresResponse) => setStores(allStoresResponse.data))
                        .then(() =>
                            ApiClient.getAllStocks(jwt).then(
                                (allStocksData) => {
                                    setStocks(allStocksData.data);
                                }
                            )
                        );
                });
        }
    }, [jwt]);

    const handleLogin = () => {
        ApiClient
            .login(userNameAndPassword)
            .then((response) => {
                console.log(response)
                setJwt(response.data.token);
            })
            .catch((_error) => setLoginError(true));
    };
    const handleLogout = () => {
        setJwt(undefined);
    };

    const handleLoginFormChanges = (field, value) => {
        setUsernameAndPassword((prevState) => {
            return {
                ...prevState,
                [field]: value,
            };
        });
    };

    const getProductName = (productId) => {
        if (products) {
            const found = products.find((p) => productId === p._id);
            if (found) {
                return found.name;
            }
        }
    };

    const getStoreName = (storeId) => {
        if (stocks) {
            const found = stores.find((s) => storeId === s._id);
            if (found) {
                return found.name;
            }
        }
    };

    const renderRow = (id, productName, qty, storeName) => {
        return (
            <View key={id} style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
                <View style={{flex: 1, alignSelf: 'stretch'}}><Text>{productName}</Text></View>
                <View style={{flex: 1, alignSelf: 'stretch'}}><Text>{qty}</Text></View>
                <View style={{flex: 1, alignSelf: 'stretch'}}><Text>{storeName}</Text></View>

            </View>
        );
    }
    return (
        <SafeAreaProvider>
            <View style={styles.container}>


                {!jwt ? (
                    <>

                        <Text>Email:</Text>

                        <Input
                            onChangeText={(value) =>
                                handleLoginFormChanges("username", value)
                            } type="email" id="fname" name="fname"/>

                        <Text>Password:</Text>
                        <Input onChangeText={(value) =>
                            handleLoginFormChanges("password", value)
                        } type="password" id="lname" name="lname"/>

                        <>
                            {loginError && (
                                <Text>Credenciales incorrectas.</Text>
                            )}
                        </>

                        <Button title="Login" onPress={handleLogin}/>
                    </>
                ) : (
                    <>
                        <>
                            <Header
                                leftComponent={{icon: 'menu', color: '#fff', iconStyle: {color: '#fff'}}}
                                centerComponent={{text: ' Stock Admin Mobile', style: {color: '#fff'}}}
                                rightComponent={<Button title="Logout" onPress={handleLogout}/>}
                            />
                            <View key={id} style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
                                <View style={{flex: 1, alignSelf: 'stretch'}}><Text>Producto</Text></View>
                                <View style={{flex: 1, alignSelf: 'stretch'}}><Text>Cantidad</Text></View>
                                <View style={{flex: 1, alignSelf: 'stretch'}}><Text>Store</Text></View>
                            </View>

                            {stocks &&
                                stocks.map((stock) => {
                                    console.log(stock)
                                    return (
                                        renderRow(stock._id, getProductName(stock.productId), stock.qty, getStoreName(stock.storeId))

                                    );
                                })}
                        </>
                    </>
                )}
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
