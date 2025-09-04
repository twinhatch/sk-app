import moment from 'moment';

/* eslint-disable prettier/prettier */
const Charges = (kms, weights, worths, bonuses) => {
    let km = Number(kms);
    let weight = Number(weights);
    let worth = Number(worths);
    let bonus = Number(bonuses);
    console.log('in charge Component===============>', km, weight, worth, bonus);
    let charges = {
        delivery_date: new Date(),
        bonus: '',
        charge: '',
    };
    let commonWorthPer = 0;
    let commonCharges = 0;
    let maxCharge = 50;
    if (km <= 5) {
        const newDate = new Date().setHours(new Date().getHours() + 2);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 10;  //bonus
        if (weight) {
            commonWorthPer = 2;
            if (weight <= 2) {
                commonCharges = 30;
                maxCharge = 50;
            } else if (weight <= 4) {
                commonCharges = 35;
                maxCharge = 60;
            } else if (weight <= 8) {
                commonCharges = 40;
                maxCharge = 70;
            } else if (weight <= 10) {
                commonCharges = 45;
                maxCharge = 80;
            }

        }
    } else if (km <= 10) {
        const newDate = new Date().setHours(new Date().getHours() + 2);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 10;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 60;
                maxCharge = 90;
            } else if (weight <= 4) {
                commonCharges = 65;
                maxCharge = 100;
            } else if (weight <= 8) {
                commonCharges = 70;
                maxCharge = 110;
            } else if (weight <= 10) {
                commonCharges = 80;
                maxCharge = 120;
            }

        }
    } else if (km <= 15) {
        const newDate = new Date().setHours(new Date().getHours() + 2.5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 25;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 100;
                maxCharge = 140;
            } else if (weight <= 4) {
                commonCharges = 105;
                maxCharge = 150;
            } else if (weight <= 8) {
                commonCharges = 160;
                maxCharge = 200;
            } else if (weight <= 10) {
                commonCharges = 190;
                maxCharge = 230;
            }

        }
    } else if (km <= 20) {
        const newDate = new Date().setHours(new Date().getHours() + 2.5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 25;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 160;
                maxCharge = 190;
            } else if (weight <= 4) {
                commonCharges = 165;
                maxCharge = 200;
            } else if (weight <= 8) {
                commonCharges = 230;
                maxCharge = 270;
            } else if (weight <= 10) {
                commonCharges = 250;
                maxCharge = 300;
            }

        }
    } else if (km <= 25) {
        const newDate = new Date().setHours(new Date().getHours() + 3);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 40;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 170;
                maxCharge = 230;
            } else if (weight <= 4) {
                commonCharges = 180;
                maxCharge = 240;
            } else if (weight <= 8) {
                commonCharges = 220;
                maxCharge = 280;
            } else if (weight <= 10) {
                commonCharges = 240;
                maxCharge = 300;
            }

        }
    } else if (km <= 30) {
        const newDate = new Date().setHours(new Date().getHours() + 3);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 40;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 210;
                maxCharge = 270;
            } else if (weight <= 4) {
                commonCharges = 215;
                maxCharge = 275;
            } else if (weight <= 8) {
                commonCharges = 250;
                maxCharge = 310;
            } else if (weight <= 10) {
                commonCharges = 270;
                maxCharge = 330;
            }
        }
    } else if (km <= 35) {
        const newDate = new Date().setHours(new Date().getHours() + 3.5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 40;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 240;
                maxCharge = 290;
            } else if (weight <= 4) {
                commonCharges = 245;
                maxCharge = 295;
            } else if (weight <= 8) {
                commonCharges = 280;
                maxCharge = 350;
            } else if (weight <= 10) {
                commonCharges = 370;
                maxCharge = 430;
            }

        }
    } else if (km <= 40) {
        const newDate = new Date().setHours(new Date().getHours() + 3.5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 40;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 260;
                maxCharge = 315;
            } else if (weight <= 4) {
                commonCharges = 265;
                maxCharge = 320;
            } else if (weight <= 8) {
                commonCharges = 290;
                maxCharge = 360;
            } else if (weight <= 10) {
                commonCharges = 300;
                maxCharge = 380;
            }

        }
    } else if (km <= 45) {
        const newDate = new Date().setHours(new Date().getHours() + 4);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 60;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 270;
                maxCharge = 340;
            } else if (weight <= 4) {
                commonCharges = 275;
                maxCharge = 350;
            } else if (weight <= 8) {
                commonCharges = 300;
                maxCharge = 380;
            } else if (weight <= 10) {
                commonCharges = 320;
                maxCharge = 400;
            }

        }
    } else if (km <= 50) {
        const newDate = new Date().setHours(new Date().getHours() + 4);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 60;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 290;
                maxCharge = 370;
            } else if (weight <= 4) {
                commonCharges = 295;
                maxCharge = 375;
            } else if (weight <= 8) {
                commonCharges = 340;
                maxCharge = 430;
            } else if (weight <= 10) {
                commonCharges = 350;
                maxCharge = 450;
            }

        }
    } else if (km <= 60) {
        const newDate = new Date().setHours(new Date().getHours() + 4.5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 60;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 310;
                maxCharge = 390;
            } else if (weight <= 4) {
                commonCharges = 315;
                maxCharge = 395;
            } else if (weight <= 8) {
                commonCharges = 380;
                maxCharge = 470;
            } else if (weight <= 10) {
                commonCharges = 400;
                maxCharge = 480;
            }

        }
    } else if (km <= 70) {
        const newDate = new Date().setHours(new Date().getHours() + 4.5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 75;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 310;
                maxCharge = 410;
            } else if (weight <= 4) {
                commonCharges = 315;
                maxCharge = 415;
            } else if (weight <= 8) {
                commonCharges = 400;
                maxCharge = 500;
            } else if (weight <= 10) {
                commonCharges = 420;
                maxCharge = 530;
            }

        }
    } else if (km <= 80) {
        const newDate = new Date().setHours(new Date().getHours() + 5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 75;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 320;
                maxCharge = 420;
            } else if (weight <= 4) {
                commonCharges = 330;
                maxCharge = 430;
            } else if (weight <= 8) {
                commonCharges = 410;
                maxCharge = 540;
            } else if (weight <= 10) {
                commonCharges = 420;
                maxCharge = 550;
            }

        }
    } else if (km <= 90) {
        const newDate = new Date().setHours(new Date().getHours() + 5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 90;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 320;
                maxCharge = 430;
            } else if (weight <= 4) {
                commonCharges = 330;
                maxCharge = 440;
            } else if (weight <= 8) {
                commonCharges = 430;
                maxCharge = 545;
            } else if (weight <= 10) {
                commonCharges = 440;
                maxCharge = 555;
            }

        }
    } else if (km <= 100) {
        const newDate = new Date().setHours(new Date().getHours() + 5);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 90;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 330;
                maxCharge = 440;
            } else if (weight <= 4) {
                commonCharges = 340;
                maxCharge = 450;
            } else if (weight <= 8) {
                commonCharges = 440;
                maxCharge = 550;
            } else if (weight <= 10) {
                commonCharges = 450;
                maxCharge = 560;
            }

        }
    } else if (km <= 150) {
        const newDate = new Date().setHours(new Date().getHours() + 6);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 100;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 400;
                maxCharge = 530;
            } else if (weight <= 4) {
                commonCharges = 420;
                maxCharge = 550;
            } else if (weight <= 8) {
                commonCharges = 480;
                maxCharge = 610;
            } else if (weight <= 10) {
                commonCharges = 500;
                maxCharge = 630;
            }

        }
    } else if (km <= 200) {
        const newDate = new Date().setHours(new Date().getHours() + 8);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 100;  //bonus
        if (weight) {
            commonWorthPer = 3;
            if (weight <= 2) {
                commonCharges = 500;
                maxCharge = 630;
            } else if (weight <= 4) {
                commonCharges = 510;
                maxCharge = 650;
            } else if (weight <= 8) {
                commonCharges = 515;
                maxCharge = 630;
            } else if (weight <= 10) {
                commonCharges = 520;
                maxCharge = 650;
            }

        }
    } else if (km <= 250) {
        const newDate = new Date().setHours(new Date().getHours() + 10);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 130;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 520;
                maxCharge = 680;
            } else if (weight <= 4) {
                commonCharges = 540;
                maxCharge = 700;
            } else if (weight <= 8) {
                commonCharges = 520;
                maxCharge = 680;
            } else if (weight <= 10) {
                commonCharges = 530;
                maxCharge = 690;
            }
        }
    } else if (km <= 300) {
        const newDate = new Date().setHours(new Date().getHours() + 12);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 130;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 560;
                maxCharge = 720;
            } else if (weight <= 4) {
                commonCharges = 570;
                maxCharge = 730;
            } else if (weight <= 8) {
                commonCharges = 570;
                maxCharge = 740;
            } else if (weight <= 10) {
                commonCharges = 580;
                maxCharge = 750;
            }
        }
    } else if (km <= 350) {
        const newDate = new Date().setHours(new Date().getHours() + 12);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 130;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 580;
                maxCharge = 740;
            } else if (weight <= 4) {
                commonCharges = 600;
                maxCharge = 760;
            } else if (weight <= 8) {
                commonCharges = 610;
                maxCharge = 770;
            } else if (weight <= 10) {
                commonCharges = 620;
                maxCharge = 790;
            }
        }
    } else if (km <= 400) {
        const newDate = new Date().setHours(new Date().getHours() + 14);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 130;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 590;
                maxCharge = 750;
            } else if (weight <= 4) {
                commonCharges = 590;
                maxCharge = 760;
            } else if (weight <= 8) {
                commonCharges = 640;
                maxCharge = 800;
            } else if (weight <= 10) {
                commonCharges = 650;
                maxCharge = 820;
            }
        }
    } else if (km <= 500) {
        const newDate = new Date().setHours(new Date().getHours() + 15);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 160;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 620;
                maxCharge = 820;
            } else if (weight <= 4) {
                commonCharges = 630;
                maxCharge = 830;
            } else if (weight <= 8) {
                commonCharges = 650;
                maxCharge = 850;
            } else if (weight <= 10) {
                commonCharges = 670;
                maxCharge = 870;
            }
        }
    } else if (km <= 600) {
        const newDate = new Date().setHours(new Date().getHours() + 15);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 160;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 640;
                maxCharge = 830;
            } else if (weight <= 4) {
                commonCharges = 690;
                maxCharge = 900;
            } else if (weight <= 8) {
                commonCharges = 750;
                maxCharge = 950;
            } else if (weight <= 10) {
                commonCharges = 850;
                maxCharge = 1050;
            }
        }
    } else if (km <= 900) {
        const newDate = new Date().setHours(new Date().getHours() + 24);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 180;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 650;
                maxCharge = 870;
            } else if (weight <= 4) {
                commonCharges = 750;
                maxCharge = 1000;
            } else if (weight <= 8) {
                commonCharges = 800;
                maxCharge = 1050;
            } else if (weight <= 10) {
                commonCharges = 850;
                maxCharge = 1100;
            }
        }
    } else if (km <= 1200) {
        const newDate = new Date().setHours(new Date().getHours() + 48);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 200;  //bonus
        if (weight) {
            commonWorthPer = 6;
            if (weight <= 2) {
                commonCharges = 700;
                maxCharge = 930;
            } else if (weight <= 4) {
                commonCharges = 900;
                maxCharge = 1200;
            } else if (weight <= 8) {
                commonCharges = 1500;
                maxCharge = 1800;
            } else if (weight <= 10) {
                commonCharges = 1800;
                maxCharge = 2100;
            }
        }
    } else if (km <= 1500) {
        const newDate = new Date().setHours(new Date().getHours() + 72);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 200;  //bonus
        if (weight) {
            commonWorthPer = 4;
            if (weight <= 2) {
                commonCharges = 750;
                maxCharge = 1000;
            } else if (weight <= 4) {
                commonCharges = 2100;
                maxCharge = 2500;
            } else if (weight <= 8) {
                commonCharges = 3500;
                maxCharge = 4000;
            } else if (weight <= 10) {
                commonCharges = 4500;
                maxCharge = 5000;
            }
        }
    } else if (km <= 2000) {
        const newDate = new Date().setHours(new Date().getHours() + 120);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 225;  //bonus
        if (weight) {
            commonWorthPer = 5;
            if (weight <= 2) {
                commonCharges = 850;
                maxCharge = 1100;
            } else if (weight <= 4) {
                commonCharges = 2500;
                maxCharge = 3000;
            } else if (weight <= 8) {
                commonCharges = 3000;
                maxCharge = 3500;
            } else if (weight <= 10) {
                commonCharges = 3500;
                maxCharge = 4000;
            }
        }
    } else if (km > 2000) {
        const newDate = new Date().setHours(new Date().getHours() + 168);
        charges.delivery_date = new Date(newDate);
        charges.bonus = bonus || 225;  //bonus
        if (weight) {
            commonWorthPer = 5;
            if (weight <= 2) {
                commonCharges = 930;
                maxCharge = 1200;
            } else if (weight <= 4) {
                commonCharges = 3500;
                maxCharge = 4000;
            } else if (weight <= 8) {
                commonCharges = 4500;
                maxCharge = 5000;
            } else if (weight <= 10) {
                commonCharges = 7500;
                maxCharge = 8000;
            }
        }
    }

    charges.charge = commonCharges + charges.bonus + ((worth / 100) * commonWorthPer);
    charges.original = charges.charge;
    charges.charge = charges.charge > maxCharge ? maxCharge : charges.charge;

    charges.delivery_date = moment(new Date(charges.delivery_date)).format();
    return charges;

};
export default Charges;
