



#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
//#include <LiquidCrystal_I2C.h>
//LiquidCrystal_I2C lcd(0X27,16,2); //SCL A5 SDA A4

#define REPORTING_PERIOD_MS     1000

// Create a PulseOximeter object
PulseOximeter pox;

// Time at which the last beat occurred
uint32_t tsLastReport = 0;

// Callback routine is executed when a pulse is detected
void onBeatDetected() {
    Serial.println("Beat!");
}

void setup() {
    Serial.begin(9600);
    Wire.begin();
    
    Wire.beginTransmission(0x53);
    Wire.write(0x2C); 
    Wire.write(0x08); 
    Wire.endTransmission();
    
    Wire.beginTransmission(0x53);
    Wire.write(0x31); 
    Wire.write(0x08); 
    Wire.endTransmission();
    
    Wire.beginTransmission(0x53);
    Wire.write(0x2D); 
    Wire.write(0x08); 
    Wire.endTransmission();
    Serial.print("Initializing pulse oximeter..");

    // Initialize sensor
    if (!pox.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }

  // Configure sensor to use 7.6mA for LED drive
  pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);

    // Register a callback routine
    pox.setOnBeatDetectedCallback(onBeatDetected);
}

void loop() {
    // Read from the sensor
    pox.update();
    
    // Grab the updated heart rate and SpO2 levels
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
        Serial.print("Heart rate:");
        Serial.print(pox.getHeartRate());
        Serial.print("bpm / SpO2:");
        Serial.print(pox.getSpO2());
        Serial.println("%");
          
         
        tsLastReport = millis();
    }

}
