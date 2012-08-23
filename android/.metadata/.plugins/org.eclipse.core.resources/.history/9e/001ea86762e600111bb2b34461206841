package com.spacekarst.cls.android.cls_signup;

import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import rsg.mailchimp.api.lists.BatchResults;

import rsg.mailchimp.api.MailChimpApiException;
import rsg.mailchimp.api.lists.ListMethods;
import rsg.mailchimp.api.lists.MergeFieldListUtil;
import android.util.Log;

public class MailChimpAPI extends Plugin {
  
	public static final String SUBSCRIBE = "subscribe";
	public static final String BATCH_SUBSCRIBE = "batch_subscribe";
	
	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		Log.d("MailChimpAPI Plugin", "Plugin Called");
		
		// extract data and options...
		JSONObject data;
		ListMethods listMethods;
		String listId;
		
		try {
			data = args.getJSONObject(0);
			JSONObject options = args.getJSONObject(1);
			listMethods = new ListMethods(options.getString("mc_api_key"));	
			listId = options.getString("mc_list_id");
		} catch (JSONException e1) {
			e1.printStackTrace();
			return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
		}
		
		if (SUBSCRIBE.equals(action)) {
			//listMethods = new ListMethods(this.cordova.getActivity().getText(com.spacekarst.cls.android.cls_signup.R.string.mc_api_key));
			try {
				addSingleToList(data, listMethods, listId);
			} catch (JSONException jx){
				jx.printStackTrace();
				return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
			}
		}
		if (BATCH_SUBSCRIBE.equals(action)) {
			try {
				addBatchToList(data, listMethods, listId);
			} catch (JSONException jx) {
				jx.printStackTrace();
				return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
			}
		}
		
		return new PluginResult(PluginResult.Status.OK);
	}

	private void addSingleToList(JSONObject data, ListMethods listMethods, String listId) throws JSONException {
    	
		String message = "Signup successful!";
		
		try {
			MergeFieldListUtil merge = new MergeFieldListUtil();

			String emailAddress = data.getString("emailAddress");
			merge.addField("FNAME", data.getString("firstName"));
			merge.addField("LNAME", data.getString("lastName"));
			//String type = obj.getString("type");
			
			listMethods.listSubscribe(listId, emailAddress, merge);
			
		} catch (JSONException e) {
			throw e;
		}
		catch (MailChimpApiException e) {
			Log.e("MailChimp", "Exception subscribing person: " + e.getMessage());
			message = "Signup failed: " + e.getMessage();
		}
    }
	
	private void addBatchToList(JSONObject data, ListMethods listMethods, String listId) throws JSONException{
		
		ArrayList<MergeFieldListUtil> fields = new ArrayList<MergeFieldListUtil>(data.length());
		String message = "Signup successful!";
		
		try {
			JSONArray names = data.names();
			for (int i = 0; i < names.length(); i++){
				JSONObject obj = data.getJSONObject(names.getString(i));
				MergeFieldListUtil merges = new MergeFieldListUtil();

				merges.addEmail(obj.getString("emailAddress"));
				merges.addField("FNAME", obj.getString("firstName"));
				merges.addField("LNAME", obj.getString("lastName"));
				fields.add(merges);
			}
		
			BatchResults results = listMethods.listBatchSubscribe(listId, fields);
		
		} catch (JSONException e) {
			throw e;
		}
		catch (MailChimpApiException e) {
			Log.e("MailChimp", "Exception batch subscribing: " + e.getMessage());
			message = "Signup failed: " + e.getMessage();
		}
	}
	
//	private void addSingleToList(JSONArray data, ListMethods listMethods, String listId) throws JSONException {
//    	
//		String message = "Signup successful!";
//		
//		try {
//			JSONObject obj = data.getJSONObject(0);
//			MergeFieldListUtil merge = new MergeFieldListUtil();
//
//			String emailAddress = obj.getString("emailAddress");
//			merge.addField("FNAME", obj.getString("firstName"));
//			merge.addField("LNAME", obj.getString("lastName"));
//			//String type = obj.getString("type");
//			
//			listMethods.listSubscribe(listId, emailAddress, merge);
//			
//		} catch (JSONException e) {
//			throw e;
//		}
//		catch (MailChimpApiException e) {
//			Log.e("MailChimp", "Exception subscribing person: " + e.getMessage());
//			message = "Signup failed: " + e.getMessage();
//		}
//    }
	
//	private void addBatchToList(JSONArray data, ListMethods listMethods, String listId) throws JSONException{
//		
//		ArrayList<MergeFieldListUtil> fields = new ArrayList<MergeFieldListUtil>(data.length());
//		String message = "Signup successful!";
//		
//		try {
//			for (int i = 0; i < data.length(); i++) {
//				JSONObject obj = data.getJSONObject(i);
//				MergeFieldListUtil merges = new MergeFieldListUtil();
//
//				merges.addEmail(obj.getString("emailAddress"));
//				merges.addField("FNAME", obj.getString("firstName"));
//				merges.addField("LNAME", obj.getString("lastName"));
//				fields.add(merges);
//			}
//		
//			BatchResults results = listMethods.listBatchSubscribe(listId, fields);
//		
//		} catch (JSONException e) {
//			throw e;
//		}
//		catch (MailChimpApiException e) {
//			Log.e("MailChimp", "Exception batch subscribing: " + e.getMessage());
//			message = "Signup failed: " + e.getMessage();
//		}
//	}
	
}