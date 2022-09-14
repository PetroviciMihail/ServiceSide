# ServiceSide

Acesta este Repository-ul aplicației pentru serivice-urile auto.

Repository-ul aplicației pentru clienți împreună cu prezentarea acesteia: https://github.com/PetroviciMihail/GoAutoService

Link-ul de unde poate fi descarcată aplicația pentru clienți: https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40petrovicivasile/GoAutoService-e2f8985ddb18470282658b849d0af6f1-signed.apk

Link-ul de unde poate fi descarcată aplicația pentru service-uri auto: https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40petrovicivasile/ServiceSide-40251ad5e1254286819273ce9d1a9041-signed.apk

Pentru service-urile auto principalele funcționalitați ale aplicației sunt posibilitatea vizualizării cererilor de preț din împrejurimi și administrarea programului pe zile și ore.

--- La fel ca și în aplicația pentru clienți, service-urile își pot crea un cont nou și se pot autentifica cu acesta.

În aplicație, în zona de jos, există 3 tab-uri. 

--- De pe ecranul  ”My Account” service-ul își stabilește câteva date de contact și alege locația acestuia pe hartă. Locația este salvată sub formă de coordonate latitudine și longitudine și va folosită mai tarziu pe ecranul ”Service Requests”.

![image](https://user-images.githubusercontent.com/61497362/190125484-fff63d37-b068-41d8-8464-0f32e93225aa.png)

--- Pe ecranul ”Service Requests” cererile de preț sunt filtrate în funcție de distanța calculată între locația service-ului și locația unde a fost creată cererea. 

Funcția de calculare a distanței între doua locații definite de latitudine și longitudine.
```
var getDistance = function (p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
```

Un alt criteriu de filtrare este categoria lucrării, deoarece atelierele pot fi specializate fie pe mecanica, vulcanizare, vopsitorie etc.

Aici service-urile pot vedea detaliile unei cereri și detaliile legate de mașină. O dată cu estimarea unui preț și trimiterea ofertei, aceasta îi va aparea clientului la detaliile cererii în aplicația sa.

![image](https://user-images.githubusercontent.com/61497362/190128571-54dc7c4b-0208-4475-9434-292b09f88c44.png)


--- Pe ecranul ”My schedule” service-ul își vizualizează programul.

Aici poate vedea clienții care și-au ales singuri un interval orar. Pentru aceștia poate marca operațiunea ca fiind executată, urmând ca aceasta să apară în istoricul vehiculului în aplicația clientului.
Programarea poate fi și anulată eliberând intervalul orar în programul service-ului și aceasta va dispărea și din programarile clientului.

![image](https://user-images.githubusercontent.com/61497362/190132440-737b5bcf-883e-4254-ba1f-7600781243a6.png)


În acest program service-ul poate adăuga programari proprii, ceea ce va marca intervalul ca fiind indiponibil pentru clienții care doresc să facă o programare.

![image](https://user-images.githubusercontent.com/61497362/190131720-d3120ddd-2938-483d-98ef-57bfb01dd796.png)

