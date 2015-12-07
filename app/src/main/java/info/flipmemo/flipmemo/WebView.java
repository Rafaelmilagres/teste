package info.flipmemo.flipmemo;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.util.EntityUtils;

public class WebView extends Activity {
    private android.webkit.WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);

        webView = (android.webkit.WebView) findViewById(R.id.webView);
        webView.setWebChromeClient(new WebChromeClient());
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            // Faz com que links externos sejam abertos no app default do sistema
            public boolean shouldOverrideUrlLoading(android.webkit.WebView view, String url) {
                if (url != null) {
                    view.getContext().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));

                    return true;
                } else {
                    return false;
                }
            }
        });

        /*webView.addJavascriptInterface(new WebAppInterface(this), "Android");*/
        /*webView.loadUrl("http://www.mateusferreira.com.br");*/
        webView.loadUrl("file:///android_asset/www/index.html");
    }

/*
    // Interface para binding Javascript -> Java
    public class WebAppInterface {
        WebView activity;

        public WebAppInterface(WebView activity) {
            this.activity = activity;
        }

        public void geraToast(String texto){
            Toast.makeText(activity, texto, Toast.LENGTH_SHORT).show();

            webView.loadUrl("javascript:resposta(\"Respondeu para o index\")");

        }

        *//*@JavascriptInterface*//*
        public void update() {
            String content;
            final int TIMEOUT = 5000;


            HttpParams httpParameters = new BasicHttpParams();
            HttpConnectionParams.setConnectionTimeout(httpParameters, TIMEOUT);
            HttpConnectionParams.setSoTimeout(httpParameters, TIMEOUT);

            DefaultHttpClient httpClient = new DefaultHttpClient(httpParameters);

            *//*HttpGet request = new HttpGet("http://geocoleta.org/api/app");

            try{
                HttpResponse response = httpClient.execute(request);
                HttpEntity httpEntity = response.getEntity();
                content = EntityUtils.toString(httpEntity);

            } catch (Exception e){
                content = "";
            }*//*

            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    webView.loadUrl("javascript:" + String.format("update_callback(%s);", content);
                }
            });

        }
    }*/
}
