#include <SocketIoClient.h>
#include<Wire.h>

// mpu vars
const int MPU_addr=0x68;
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;
 
int minVal=265;
int maxVal=402;
 
double x;
double y;
double z;

//socket client vars
SocketIoClient wsClient;

const char* ssid     = "Don juan";
const char* password = "kuiw5203";
const char* host = "192.168.100.110";  //replace this ip address with the ip address of your Node.Js server
uint16_t port= 3000;

void feedbackHandler(const char * payload, size_t length) {
  Serial.printf("got message: %s\n", payload);
  }
void setup() {
  //set up for mpu 
  Wire.begin();
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  // put your setup code here, to run once:
  Serial.begin(115200);
  
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  delay(1000);

  

  wsClient.on("reply" ,feedbackHandler);

  wsClient.begin("192.168.100.110" , 3000);
  
  
}

void loop() {
  // put your main code here, to run repeatedly:
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_addr,14,true);
  AcX=Wire.read()<<8|Wire.read();
  AcY=Wire.read()<<8|Wire.read();
  AcZ=Wire.read()<<8|Wire.read();
  int xAng = map(AcX,minVal,maxVal,-90,90);
  int yAng = map(AcY,minVal,maxVal,-90,90);
  int zAng = map(AcZ,minVal,maxVal,-90,90);
   
  x= RAD_TO_DEG * (atan2(-yAng, -zAng)+PI);
  y= RAD_TO_DEG * (atan2(-xAng, -zAng)+PI);
  z= RAD_TO_DEG * (atan2(-yAng, -xAng)+PI); 
  String motion = (String) "\"" + x + "," + y + "," + z + "\"";
  Serial.println(motion); 
  const char* charmotion = motion.c_str();
  
  wsClient.loop();

  
  wsClient.emit("message", charmotion);
  delay(250);
}
