INSERT INTO public.category (id,"name","createdAt","updatedAt") VALUES
	 ('3f5f6e09-441d-47b9-b31b-8e0a4966ecaf','Chit Chat','2022-07-20 17:12:22.202887','2022-07-20 17:12:22.202887'),
	 ('6cada232-5f87-4a7e-94cb-4a3d5ba997a5','Brain Teasers','2022-07-20 17:12:41.174864','2022-07-20 17:12:41.174864'),
	 ('a32e35b3-cff4-4b0f-abc7-28b26fd62319','Pop Quiz','2022-07-20 17:12:56.755657','2022-07-20 17:12:56.755657'),
	 ('d1e7a694-05cf-4279-ac0e-a098d0fd0b3a','Good ol Banter','2022-07-20 17:13:07.640637','2022-07-20 17:13:07.640637');
INSERT INTO public.question (id,"text",image_url,"createdAt","updatedAt","isEdited") VALUES
	 ('8f6fad2e-e44d-4a8a-b32d-c182d9cf245d','What is y''alls favourite TV show? :)',NULL,'2022-07-21 20:48:40.265165','2022-07-21 20:48:40.265165',false),
	 ('618596d2-13b3-4a90-b08f-96c1a2ae06ab','What''s the dumbest thing you have done?',NULL,'2022-07-21 20:49:24.38566','2022-07-21 20:49:24.38566',false),
	 ('b6188777-f6bc-4a4d-a153-a8047b83de00','You are in a room that has three switches and a closed door. The switches control three light bulbs on the other side of the door. Once you open the door, you may never touch the switches again. How can you definitively tell which switch is connected to each of the light bulbs?',NULL,'2022-07-21 20:50:53.067527','2022-07-21 20:50:53.067527',false),
	 ('0738b0d5-ff9a-4418-a265-2acdf1ad48fa','I left my campsite and hiked south for 3 miles. Then I turned east and hiked for 3 miles. I then turned north and hiked for 3 miles, at which time I came upon a bear inside my tent eating my food! What color was the bear?',NULL,'2022-07-21 20:51:13.626992','2022-07-21 20:51:13.626992',false),
	 ('c756edc9-00c5-45ed-ac13-99fb6e61aab8','PHP is compiled or interpreted?',NULL,'2022-07-21 20:51:59.624548','2022-07-21 20:51:59.624548',false),
	 ('28471cc3-e1a3-4dad-bebe-51e460907b5a','React is a library or framework?',NULL,'2022-07-21 20:52:27.926785','2022-07-21 20:52:27.926785',false),
	 ('10ba3ec5-ab32-4a46-b9e3-af0d731c58f7','Messi Vs Ronaldo?',NULL,'2022-07-21 20:53:20.26562','2022-07-21 20:53:20.26562',false),
	 ('0942af1a-512b-485c-bc1c-27e182c48a98','Republicans Vs Decmocrats',NULL,'2022-07-21 20:53:42.109899','2022-07-21 20:53:42.109899',false),
	 ('5f34bf48-8860-472b-8f6b-cae6dc2eda1f','Utd vs City',NULL,'2022-07-24 18:19:55.766333','2022-07-24 18:19:55.766333',false);
INSERT INTO public.questions_categories ("questionId","categoryId") VALUES
	 ('8f6fad2e-e44d-4a8a-b32d-c182d9cf245d','3f5f6e09-441d-47b9-b31b-8e0a4966ecaf'),
	 ('618596d2-13b3-4a90-b08f-96c1a2ae06ab','3f5f6e09-441d-47b9-b31b-8e0a4966ecaf'),
	 ('b6188777-f6bc-4a4d-a153-a8047b83de00','6cada232-5f87-4a7e-94cb-4a3d5ba997a5'),
	 ('0738b0d5-ff9a-4418-a265-2acdf1ad48fa','6cada232-5f87-4a7e-94cb-4a3d5ba997a5'),
	 ('c756edc9-00c5-45ed-ac13-99fb6e61aab8','a32e35b3-cff4-4b0f-abc7-28b26fd62319'),
	 ('28471cc3-e1a3-4dad-bebe-51e460907b5a','a32e35b3-cff4-4b0f-abc7-28b26fd62319'),
	 ('10ba3ec5-ab32-4a46-b9e3-af0d731c58f7','d1e7a694-05cf-4279-ac0e-a098d0fd0b3a'),
	 ('0942af1a-512b-485c-bc1c-27e182c48a98','d1e7a694-05cf-4279-ac0e-a098d0fd0b3a'),
	 ('5f34bf48-8860-472b-8f6b-cae6dc2eda1f','d1e7a694-05cf-4279-ac0e-a098d0fd0b3a'),
	 ('5f34bf48-8860-472b-8f6b-cae6dc2eda1f','a32e35b3-cff4-4b0f-abc7-28b26fd62319');
