#include <Arduino.h>
#include <WiFi.h>
#include <Web3.h>
#include <Contract.h>
#include <Crypto.h>
#include <vector>
#include <string>
#include <Util.h>
#include <EEPROM.h>  // For store permanent data


#define EEPROM_SIZE 2
const char *ssid = "Venomous";
const char *password = "aliroba19661";
#define NATIVE_ETH_TOKENS "Goerli ETH"                                //if you switch chains you might want to change this
#define ERC721CONTRACT "0x9B526Fd66db696a266cb9309E3545FE864D78079"  //an ERC721 token contract on Goerli
#define USERACCOUNT "0x8de119dec454624dced3a48030d697b6e597446f"     // convert to lowercase & a user account that holds Goerli ETH and balances of tokens in the two above contracts 

Web3 *web3;
int wificounter = 0;

void queryERC721(const char* Address, const char* ERC721ContractAddress);
void setup_wifi();
string convertToAddress(string input);
void writeFlashMemory(int tokenId);

void setup()
{
    Serial.begin(115200); //ensure you set your Arduino IDE port config or platformio.ini with monitor_speed = 115200
    setup_wifi();

    EEPROM.begin(EEPROM_SIZE);
    // writeFlashMemory(1); // uncomment this to write tokenId on flash memory

    web3 = new Web3(GOERLI_ID); // For Goerli Testnet
    string userAddress = USERACCOUNT;
	queryERC721(ERC721CONTRACT, USERACCOUNT);
}


void loop() 
{
    // put your main code here, to run repeatedly.
}

/* Query of ERC721 tokens */
void queryERC721(const char* ContractAddress, const char *userAddress)
{
	// initialization contract
	Contract contract(web3, ContractAddress);

	string myAddr = userAddress;

    Serial.print("Contract address: ");
	Serial.println(ContractAddress);
    Serial.print("User address: ");
	Serial.println(myAddr.c_str());

    // Contract balanceOf(address)
	string func = "balanceOf(address)";
	string param = contract.SetupContractData(func.c_str(), &myAddr);
	string result = contract.ViewCall(&param);
    Serial.println(result.c_str());
    string contractBal = web3->getString(&result);
    int bbb = stoi(contractBal, 0, 16);
    Serial.println(bbb);

    // Contract ownerOf(uint256)
    string func0 = "ownerOf(uint256)";
    uint256_t tokenId = EEPROM.read(0); // Read tokenId from flash memory

    string param0 = contract.SetupContractData(func0.c_str(), &tokenId);
	string result0 = contract.ViewCall(&param0);
    Serial.println("Owner of token id");
    Serial.println(result0.c_str());
    string contractToken = web3->getString(&result0);
    string ttt = convertToAddress(contractToken.c_str());
    Serial.println(ttt.c_str());

    if (ttt ==  myAddr){
        Serial.println("User Authenticated");
    }
    else {
        Serial.println("User not Same");
    }

	// Contract name()
	param = contract.SetupContractData("name()", &userAddress);
	result = contract.ViewCall(&param);
	string contractName = web3->getString(&result);
	string interpreted = Util::InterpretStringResult(contractName.c_str());
    Serial.println("NAME: ");
	Serial.println(interpreted.c_str());
    Serial.print("EEPROM: ");
    Serial.println(EEPROM.read(0));
}

string convertToAddress(string input)
{
     return "0x"+input.substr(input.size() - 40);
}

void writeFlashMemory(int tokenId){
    EEPROM.write(0, tokenId);
    EEPROM.commit();
}

/* This routine is specifically geared for ESP32 perculiarities */
/* You may need to change the code as required */
/* It should work on 8266 as well */
void setup_wifi()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        return;
    }

    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    if (WiFi.status() != WL_CONNECTED)
    {
        WiFi.persistent(false);
        WiFi.mode(WIFI_OFF);
        WiFi.mode(WIFI_STA);

        WiFi.begin(ssid, password);
    }

    wificounter = 0;
    while (WiFi.status() != WL_CONNECTED && wificounter < 10)
    {
        for (int i = 0; i < 500; i++)
        {
            delay(1);
        }
        Serial.print(".");
        wificounter++;
    }

    if (wificounter >= 10)
    {
        Serial.println("Restarting ...");
        ESP.restart(); //targetting 8266 & Esp32 - you may need to replace this
    }

    delay(10);

    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}